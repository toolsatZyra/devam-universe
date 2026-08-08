#!/usr/bin/env python3
"""Remove only disposable files created by the local MVP scaffold."""

from __future__ import annotations

import os
import shutil
import stat
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
EXPECTED_ROOT = Path(r"C:\Work\Code\sanatan_knowledge_graph").resolve()
NESTED_GIT = ROOT / "apps" / "web" / ".git"
LOGS = (
    "install.stdout.log",
    "install.stderr.log",
    "preview.stdout.log",
    "preview.stderr.log",
    "scaffold.stdout.log",
    "scaffold.stderr.log",
)


def assert_safe(path: Path) -> None:
    if ROOT != EXPECTED_ROOT or path.parent == path:
        raise RuntimeError("unexpected workspace boundary")
    path.absolute().relative_to(ROOT)
    for ancestor in path.parents:
        if ancestor == ROOT.parent:
            break
        if ancestor.exists():
            st = ancestor.lstat()
            if stat.S_ISLNK(st.st_mode) or bool(getattr(st, "st_file_attributes", 0) & 0x400):
                raise RuntimeError(f"linked/reparse ancestor rejected: {ancestor}")


def main() -> None:
    removed: list[str] = []
    assert_safe(NESTED_GIT)
    if NESTED_GIT.exists():
        st = NESTED_GIT.lstat()
        if not stat.S_ISDIR(st.st_mode) or stat.S_ISLNK(st.st_mode):
            raise RuntimeError("nested .git is not an ordinary directory")
        def clear_readonly(function, failing_path, _excinfo):
            os.chmod(failing_path, stat.S_IWRITE)
            function(failing_path)

        shutil.rmtree(NESTED_GIT, onexc=clear_readonly)
        removed.append("apps/web/.git")

    for name in LOGS:
        target = ROOT / name
        assert_safe(target)
        if target.exists():
            st = target.lstat()
            if not stat.S_ISREG(st.st_mode) or stat.S_ISLNK(st.st_mode):
                raise RuntimeError(f"log is not an ordinary file: {target}")
            os.unlink(target)
            removed.append(name)

    print({"result": "PASS", "removed": removed})


if __name__ == "__main__":
    main()
