#!/usr/bin/env python
"""
Script to run tests for the TaskSync backend.
"""
import os
import sys
import subprocess
import argparse

def run_tests(app=None, test_class=None, test_method=None):
    """Run Django tests with specified parameters."""
    command = [sys.executable, 'manage.py', 'test']
    
    if test_method:
        # If test method is specified, it includes the app and class
        command.append(test_method)
    elif test_class:
        # If test class is specified, it includes the app
        command.append(test_class)
    elif app:
        # Just the app
        command.append(app)
    
    print(f"Running command: {' '.join(command)}")
    subprocess.run(command)

def main():
    """Parse arguments and run tests."""
    parser = argparse.ArgumentParser(description='Run TaskSync backend tests')
    parser.add_argument('--app', help='Specific app to test (e.g., api)')
    parser.add_argument('--class', dest='test_class', help='Specific test class to run (e.g., api.tests.DatabaseConnectionTest)')
    parser.add_argument('--method', dest='test_method', help='Specific test method to run (e.g., api.tests.AdminSiteTest.test_admin_site_accessible)')
    
    args = parser.parse_args()
    
    run_tests(args.app, args.test_class, args.test_method)

if __name__ == '__main__':
    main()