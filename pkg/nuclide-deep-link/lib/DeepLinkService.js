/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {DeepLinkParams} from './types';

import electron from 'electron';
import invariant from 'assert';
import {Observable} from 'rxjs';

import UniversalDisposable from 'nuclide-commons/UniversalDisposable';
import {observeDeepLinks, sendDeepLink} from '../../commons-atom/deep-link';
import SharedObservableCache from '../../commons-node/SharedObservableCache';

const {ipcRenderer, remote} = electron;
invariant(ipcRenderer != null && remote != null);

export default class DeepLinkService {
  _disposable: UniversalDisposable;
  _observers: Map<string, rxjs$Observer<DeepLinkParams>>;
  _observables: SharedObservableCache<string, DeepLinkParams>;
  _pendingEvents: Map<string, Array<Object>>;

  constructor() {
    this._observers = new Map();
    this._pendingEvents = new Map();
    this._observables = new SharedObservableCache(path => {
      return Observable.create(observer => {
        this._observers.set(path, observer);
        return () => this._observers.delete(path);
      }).share();
    });

    this._disposable = new UniversalDisposable(
      observeDeepLinks().subscribe(({message, params}) => {
        const path = message.replace(/\/+$/, '');
        const observer = this._observers.get(path);
        if (observer != null) {
          observer.next(params);
        }
      }),
      () => this._observers.forEach(observer => observer.complete()),
    );
  }

  dispose(): void {
    this._disposable.dispose();
  }

  subscribeToPath(
    path: string,
    callback: (params: DeepLinkParams) => mixed,
  ): IDisposable {
    const result = new UniversalDisposable(
      this._observables.get(path).subscribe(callback),
    );

    return result;
  }

  sendDeepLink(
    browserWindow: electron$BrowserWindow,
    path: string,
    params: DeepLinkParams,
  ): void {
    sendDeepLink(browserWindow, path, params);
    browserWindow.focus();
  }
}
