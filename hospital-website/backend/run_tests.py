import pytest
import sys
import os
from pathlib import Path

def run_tests():
    """Run the test suite."""
    # Get the absolute path to the backend directory
    backend_dir = Path(__file__).parent.absolute()
    
    # Add backend directory to Python path so it can find the app module
    sys.path.append(str(backend_dir))
    
    # Change to the backend directory
    os.chdir(backend_dir)
    
    args = [
        "--verbose",
        "--rootdir=.",  # Set root directory to backend
        "tests/",  # Path to tests directory
    ]
    
    # Add coverage arguments if pytest-cov is installed
    try:
        import pytest_cov
        args.extend([
            "--cov=app",  # Coverage for app directory
            "--cov-report=term-missing",
            "--cov-report=html:coverage_html",  # Optional: Generate HTML coverage report
        ])
    except ImportError:
        print("pytest-cov not installed. Running without coverage report.")
    
    return pytest.main(args)

if __name__ == "__main__":
    sys.exit(run_tests())