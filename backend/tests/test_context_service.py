"""Tests for context service - verifies parity with JS contextBuilder."""
from app.services.context_service import ContextService


def _make_section(act="IPC", section="302", title="Test Title", text="Some legal text here"):
    return {"act": act, "section": section, "title": title, "text": text, "score": 5}


def test_build_context_single_section():
    svc = ContextService()
    sections = [_make_section()]
    result = svc.build_context(sections)
    assert "Act: IPC" in result
    assert "Section: 302" in result
    assert "Test Title" in result
    assert "Some legal text here" in result


def test_build_context_respects_max_chars():
    svc = ContextService()
    # Create sections with long text
    sections = [
        _make_section(text="x" * 2000),
        _make_section(section="303", text="y" * 2000),
    ]
    result = svc.build_context(sections, max_chars=3000)
    assert len(result) <= 3000


def test_build_context_truncates_large_first_block():
    svc = ContextService()
    sections = [_make_section(text="x" * 5000)]
    result = svc.build_context(sections, max_chars=100)
    assert len(result) <= 100


def test_build_context_empty_sections():
    svc = ContextService()
    result = svc.build_context([])
    assert result == ""


def test_build_context_multiple_sections():
    svc = ContextService()
    sections = [
        _make_section(section="302", text="Murder text"),
        _make_section(section="304", text="Culpable homicide text"),
    ]
    result = svc.build_context(sections)
    assert "302" in result
    assert "304" in result
