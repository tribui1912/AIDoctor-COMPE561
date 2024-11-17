import pytest
import sys

def run_tests():
    """Run the test suite."""
    args = [
        "--verbose",
        "--cov=app",
        "--cov-report=term-missing",
        "tests/"
    ]
    
    # Add any command line arguments
    args.extend(sys.argv[1:])
    
    return pytest.main(args)

if __name__ == "__main__":
    sys.exit(run_tests())