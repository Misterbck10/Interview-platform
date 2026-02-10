'use server';

import { db, auth } from "@/firebase/admin"
import { cookies } from "next/headers";


// Session duration (1 Week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

// Set session cookie
export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();

    // Create a session cookie
    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: SESSION_DURATION * 1000,
    });

    // Set cookie in the browser
    cookieStore.set('session', sessionCookie, {
        maxAge: SESSION_DURATION,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
    });
}

/**
 * Sign up a new user and save their data to Firestore
 * @param params - User signup parameters (uid, name, email)
 * @returns Success status and message
 */
export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;

    try {
        // Check if a user already exists in a Firestore database
        const userRecord = await db.collection('users').doc(uid).get();
        if (userRecord.exists)
            return {
                success: false,
                message: "User already exists. Please sign in.",
            };

        // Save the new user data to Firestore
        await db.collection('users').doc(uid).set({
            name,
            email,
        });

        // Return success response
        return {
            success: true,
            message: "Account created successfully. Please sign in."
        };
    } catch (error: unknown) {
        // Log the error for debugging purposes
        console.error("Error creating a user:", error);

        // Handle Firebase-specific errors
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            (error as { code?: string }).code === "auth/email-already-exists"
        ) {
            // Email is already registered in Firebase Authentication
            return {
                success: false,
                message: "This email is already in use",
            };
        }

        // Return a generic error message for any other errors
        return {
            success: false,
            message: "Failed to create account. Please try again.",
        };

    }

}


/**
 * Sign in an existing user and create a session cookie
 * @param params - User signin parameters (email, idToken)
 * @returns Success status and message
 */
export async function signIn(params: SignInParams) {
    const { email, idToken } = params;

    try {
        // Verify that the user exists in Firebase Authentication
        const userRecord = await auth.getUserByEmail(email);
        if (!userRecord)
            return {
                success: false,
                message: "User does not exist. Create an account.",
            };

        // Create and set the session cookie for the authenticated user
        await setSessionCookie(idToken);

    } catch (error: unknown) {
        // Log the error for debugging purposes
        console.error("Error signing in user:", error);

        // Handle Firebase-specific errors
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error
        ) {
            const errorCode = (error as { code?: string }).code;

            // User isn't found in Firebase Authentication
            if (errorCode === "auth/user-not-found") {
                return {
                    success: false,
                    message: "User does not exist. Please create an account.",
                };
            }

            // Invalid email/password combination
            if (errorCode === "auth/invalid-credential" || errorCode === "auth/wrong-password") {
                return {
                    success: false,
                    message: "Invalid credentials. Please try again.",
                };
            }

            // Authentication token or session has expired
            if (errorCode === "auth/id-token-expired" || errorCode === "auth/session-cookie-expired") {
                return {
                    success: false,
                    message: "Session expired. Please sign in again.",
                };
            }
        }

        // Return a generic error message for any other errors
        return {
            success: false,
            message: "Failed to log into account. Please try again.",
        };

    }
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) return null;

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

        // get user info from db
        const userRecord = await db
            .collection("users")
            .doc(decodedClaims.uid)
            .get();

        if (!userRecord.exists) return null;

        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User;

    } catch (error) {
        console.log(error)

        // Invalid or expired session
        return null;
    }

}

export async function isAuthenticated() {
    const user = await getCurrentUser();

    return !!user;
}

