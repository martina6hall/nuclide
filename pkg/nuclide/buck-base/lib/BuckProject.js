'use babel';
/* @flow */

/**
 * Represents a Buck project on disk. All Buck commands for a project should be
 * done through an instance of this class.
 */
class BuckProject {

  getPath(): Promise<NuclideUri> {
    return Promise.reject('Not implemented');
  }

  /**
   * Returns an array of strings (that are build targets) by running:
   *
   *     buck audit owner <path>
   *
   * @param filePath absolute path or a local or a remote file.
   * @return Promise that resolves to an array of build targets.
   */
  getOwner(filePath: NuclideUri): Promise<Array<string>> {
    return Promise.reject('Not implemented');
  }

  /**
   * Runs `buck build --keep-going --build-report <tempfile>` with the specified targets. Regardless
   * whether the build is successful, this returns the parsed version of the JSON report
   * produced by the {@code --build-report} option:
   * http://facebook.github.io/buck/command/build.html.
   *
   * An error should be thrown only if the specified targets are invalid.
   */
  build(buildTargets: Array<string> | string): Promise<mixed> {
    return Promise.reject('Not implemented');
  }

  findTargetsWithReferencedFile(filePath: NuclideUri, options: mixed): Promise<{json: mixed; targets: Array<mixed>}> {
    return Promise.reject('Not implemented');
  }

  listAliases(): Promise<Array<string>> {
    return Promise.reject('Not implemented');
  }

  resolveAlias(aliasOrTarget: string): Promise<string> {
    return Promise.reject('Not implemented');
  }

  outputFileFor(aliasOrTarget: string): Promise<?string> {
    return Promise.reject('Not implemented');
  }

  buildRuleTypeFor(aliasOrTarget: string): Promise<string> {
    return Promise.reject('Not implemented');
  }

  /**
   * Find the Buck file where the target is defined.
   */
  findTargetLocation(
    path: NuclideUri, 
    name: string
  ): Promise<?{path: NuclideUri; line: number; column: number}> {
    return Promise.reject('Not implemented');
  }

  getServerPort(): Promise<number> {
    return Promise.reject('Not implemented');
  }
}

module.exports = BuckProject;
