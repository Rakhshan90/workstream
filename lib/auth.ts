import CredentialsProvider from "next-auth/providers/credentials"
import { pages } from 'next/dist/build/templates/app-page';
import { signIn } from "next-auth/react";
import db from '../db/index';
import bcrypt from 'bcrypt';

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith@gamil.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials:any) {

                const existingUser = await db.user.findFirst({
                    where: {
                        email: credentials?.username,
                    }
                });

                if(existingUser){
                    const validated = await bcrypt.compare(credentials?.password, existingUser?.password);
                    if(validated){
                        return {
                            id: existingUser?.id.toString(),
                            name: existingUser?.name,
                            email: existingUser?.email
                        }
                    }

                    return null;
                }
                // Return null if user data could not be retrieved
                return null
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        session: ({session, user, token}: any)=>{
            if(session && session.user){
                session.user.id = token.sub;
            }
            return session;
        }
    },
    pages: {
        signIn: '/signin',
    }
}