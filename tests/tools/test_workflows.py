"""Local Action configuration must be available before review starts."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[2]


def test_dependency_review_checks_out_local_configuration_without_saved_credentials():
    workflow = (ROOT / '.github/workflows/dependency-review.yml').read_text(encoding='utf-8')
    checkout = re.search(r'uses: actions/checkout@([a-f0-9]{40})', workflow)
    review = re.search(r'uses: actions/dependency-review-action@[^\s]+', workflow)
    assert checkout and review and checkout.start() < review.start()
    assert 'persist-credentials: false' in workflow[checkout.end():review.start()]
    config = re.search(r'config-file: (\./[^\s]+)', workflow)
    assert config is not None
    configuration = (ROOT / config[1]).read_text(encoding='utf-8')
    assert 'fail-on-severity: high' in configuration
