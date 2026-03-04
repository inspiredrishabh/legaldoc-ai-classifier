import pytest
from pathlib import Path
from app.config import Settings


@pytest.fixture
def settings():
    """Create settings pointing to actual data directory."""
    return Settings()


@pytest.fixture
def sample_acts(settings):
    """Load all act sections from data directory."""
    from app.loaders.data_loader import load_all_acts
    return load_all_acts(settings)


@pytest.fixture
def sample_qa(settings):
    """Load all QA pairs from data directory."""
    from app.loaders.data_loader import load_all_qa
    return load_all_qa(settings)
