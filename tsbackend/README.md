# TaskSync Backend

## Testing

This project includes a comprehensive test suite to ensure all components work correctly.

### Running Tests

#### Using Django's test runner directly:

To run all tests:

```bash
python manage.py test
```

To run tests for a specific app:

```bash
python manage.py test api
```

To run a specific test class:

```bash
python manage.py test api.tests.DatabaseConnectionTest
```

To run a specific test method:

```bash
python manage.py test api.tests.AdminSiteTest.test_admin_site_accessible
```

#### Using the helper script:

A helper script `run_tests.py` is provided for convenience:

To run all tests:

```bash
python run_tests.py
```

To run tests for a specific app:

```bash
python run_tests.py --app api
```

To run a specific test class:

```bash
python run_tests.py --class api.tests.DatabaseConnectionTest
```

To run a specific test method:

```bash
python run_tests.py --method api.tests.AdminSiteTest.test_admin_site_accessible
```

### Test Coverage

The test suite covers:

1. **Database Connection** - Verifies the database connection is working properly
2. **Admin Site** - Tests that the Django admin interface is accessible
3. **JWT Authentication** - Validates the JWT authentication setup
4. **Models** - Contains placeholder tests for models (to be expanded as models are created)
5. **Views** - Contains placeholder tests for API views (to be expanded as views are created)
6. **URLs** - Contains placeholder tests for URL routing (to be expanded as URLs are created)

### Adding New Tests

As you develop new features, add corresponding tests to the `tests.py` file in the appropriate app directory. Follow the existing pattern of creating test classes for related functionality.

For model tests, create methods that validate:
- Model creation
- Field validations
- Model methods
- Relationships between models

For view tests, create methods that validate:
- Response status codes
- Response content
- Authentication requirements
- Permissions

### Test Database

Tests use a separate test database that is created and destroyed during the test run. This ensures your development or production database is not affected by test operations.

## Test Development Roadmap

As the TaskSync project evolves, consider these recommendations for expanding the test suite:

1. **Implement Test-Driven Development (TDD)** - Write tests before implementing new features
2. **Add Integration Tests** - Test how different components work together
3. **Create API Contract Tests** - Ensure API endpoints adhere to their specified contracts
4. **Add Performance Tests** - Test the performance of critical operations
5. **Implement Continuous Integration** - Automate test runs on code changes

### Test Organization

As the test suite grows, consider organizing tests into separate files:

```
api/
  tests/
    __init__.py
    test_models.py
    test_views.py
    test_authentication.py
    test_urls.py
```

This structure makes it easier to maintain and extend the test suite as the project grows.
