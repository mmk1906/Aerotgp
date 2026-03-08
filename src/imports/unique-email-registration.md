Implement a restriction in the user registration system so that each email address can only be used *once* to create an account.

Follow these requirements:

1. Enforce Unique Email Validation

Before creating a new user account, the system must check the database to see if the email already exists.

Workflow:

User submits registration form
→ System checks database for existing email
→ If email already exists, stop registration
→ Show error message: “This email is already registered. Please log in instead.”

2. Database-Level Protection

Add a *unique constraint on the email field* in the user database collection so that duplicate emails cannot be stored even if validation fails at the frontend.

3. Improve Registration Form Validation

The registration form must validate:

* Email format
* Required fields
* Duplicate email prevention

If a duplicate email is detected, show a clear message such as:

“An account with this email already exists. Please log in or use a different email.”

4. Prevent Duplicate Accounts from API Calls

Even if someone tries to send a manual API request, the backend must still block duplicate email registrations.

The backend should return an error response if the email already exists.

5. Improve User Experience

When a duplicate email is detected, provide the following options:

* Go to login page
* Reset password option

6. Test the System

Verify the following cases:

* New email → account is created successfully
* Existing email → registration is blocked
* Database does not store duplicate emails

Final Goal

Ensure the system maintains *one account per email address*, preventing duplicate registrations and maintaining clean user data.