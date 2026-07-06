# Release Process

This package is consumed as a tokenless git dependency. No npm publish required.

1. **Bump version** in `package.json` following [semver](https://semver.org).
2. **Update `CHANGELOG.md`** with the new version section and date.
3. **Commit and push** to `main` (via PR).
4. **Create and push a tag:**
   ```bash
   git tag vX.Y.Z && git push origin vX.Y.Z
   ```
5. **Notify consumers** to update their `package.json` pins:
   - **Socratic Trade (Socratic.Trade)**: Uses exact tag pinning (e.g. `#v1.3.3`). Requires an explicit package.json bump.
   - **Congress.Trade**: Uses semver range pinning (e.g. `#semver:^1.3.0`). Only needs a lockfile refresh to resolve the new tag.
