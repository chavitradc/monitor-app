"use server";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/type";
import { cookies } from "next/headers";
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { redirect } from "next/navigation";


export const getSession = async () => {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  
  if (!session.isLoggedIn) {
      session.isLoggedIn = false;
  }
  return session;
};
type LoginState = {
  error: string | undefined;
};
export const login = async (prevState: LoginState, formData: FormData) => {
  await connectDB();
  const session = await getSession();

  const formUsername = formData.get("username") as string;
  const formPassword = formData.get("password") as string;

  // Check if form data is provided
  if (!formUsername || !formPassword) {
    return { error: "Both username and password are required." };
  }

  try {
    const user = await User.findOne({ username: formUsername });

    if (!user) {
      return { error: "Login failed. Please check your credentials." };
    }

    const isPasswordValid = await user.comparePassword(formPassword);

    if (!isPasswordValid) {
      return { error: "Login failed. Please check your credentials." };
    }

    session.userId = user._id.toString();
    session.username = user.username;
    session.firstname = user.firstname;
    session.lastname = user.lastname;
    session.isLoggedIn = true;

    console.log("Session before save:", session);

    await session.save();

    console.log("Session after save:", session);
    return { success: true };

  } catch (error) {
    console.log(error);
    return { error: "An error occurred during login. Please try again." };
  }
};


type RegisterResponse = {
    error?: string
    success?: boolean
}

export const register = async (formData: FormData): Promise<RegisterResponse> => {
    await connectDB();
  
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const firstname = formData.get("firstname") as string;
    const lastname = formData.get("lastname") as string;
  
    // Check if all form fields are provided
    if (!username || !password || !firstname || !lastname) {
      return { error: "All fields are required." };
    }
  
    try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return { error: "Username already exists." };
      }
  
      const user = new User({
        username,
        password,
        firstname,
        lastname,
      });
  
      await user.save();
      return { success: true }; // Explicit return for a successful save
    } catch (error) {
      console.log(error);
      return { error: "An error occurred during registration. Please try again." };
    }
  };


  export const logout = async () => {
    // Get the current session
    const session = await getIronSession(await cookies(), sessionOptions);
  
    // Destroy the session
    await session.destroy();
  
   
    redirect("/login"); 
  };