/* eslint-disable */
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from './mongoose';
import UserModel from '../models/User';
import { NextRequest } from 'next/server';

connectDB();




export interface DecodedToken {
  id: string;
  email: string;
  role: string;
}

type ExtendedUser = {
  id: string;
  email: string;
  role: string;
  name: string;
  lastName: string; // Agregar lastName
  phone: string;    // Agregar phone
  address: string; // ⬅️ nuevo
  city: string;    // ⬅️ nuevo
  zipCode: string; // ⬅️ nuevo
  image: string;
  token: string;
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.ID_GOOGLE as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'tu@email.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<ExtendedUser | null> {
        await connectDB();
        const user = await UserModel.findOne({ email: credentials?.email });

        if (!user) throw new Error('Usuario no encontrado');

        const isMatch = await bcrypt.compare(credentials!.password, user.password);
        if (!isMatch) throw new Error('Contraseña incorrecta');

        const token = jwt.sign(
          { id: user.id.toString(), email: user.email, role: user.role },
          process.env.JWT_SECRET as string,
          { expiresIn: '1h' }
        );

        return {
          id: user.id.toString(),
          email: user.email,
          role: user.role,
          name: user.name,
          lastName: user.lastName || '', // Agregar lastName
          phone: user.phone || '',       // Agregar phone
          address: user.address || '',   // ⬅️ nuevo
          city: user.city || '',         // ⬅️ nuevo
          zipCode: user.zipCode || '',   // ⬅️ nuevo
          image: user.img,
          token,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      await connectDB();
    
      if (account?.provider === 'google') {
        let existingUser = await UserModel.findOne({ email: user.email });
    
        if (!existingUser) {
          existingUser = new UserModel({
            name: user.name || '',
            lastName: '',
            phone: '',
            address: '',   // nuevo
            city: '',      // nuevo
            zipCode: '',   // nuevo
            email: user.email,
            img: user.image || '',
            password: await bcrypt.hash('google-auth', 10),
            role: 'user',
            google: true,
          });
          await existingUser.save();
        }
    
        const token = jwt.sign(
          {
            id: existingUser.id.toString(),
            email: existingUser.email,
            role: existingUser.role,
            name: existingUser.name,
            lastName: existingUser.lastName,
            phone: existingUser.phone,
            address: existingUser.address, // ⬅️ nuevo
            city: existingUser.city,       // ⬅️ nuevo
            zipCode: existingUser.zipCode, // ⬅️ nuevo
          },
          process.env.JWT_SECRET as string,
          { expiresIn: '1h' }
        );
    
        const u = user as ExtendedUser; // ⬅️ casteo importante
    
        u.id = existingUser.id.toString();
        u.role = existingUser.role;
        u.token = token;
        u.lastName = existingUser.lastName || '';
        u.phone = existingUser.phone || '';
        u.address = existingUser.address || '';
        u.city = existingUser.city || '';
        u.zipCode = existingUser.zipCode || '';
        u.image = existingUser.img || '';
        u.name = existingUser.name || '';
      }
    
      return true;
    }
    ,

    async jwt({ token, user }) {
      if (user) {
        const u = user as ExtendedUser;
        token.id = u.id;
        token.email = u.email;
        token.role = u.role;
        token.name = u.name;
        token.lastName = u.lastName; // Agregar lastName
        token.phone = u.phone;       // Agregar phone
        token.address = u.address;   // ⬅️ nuevo
        token.city = u.city;         // ⬅️ nuevo
        token.zipCode = u.zipCode;   // ⬅️ nuevo
        token.image = u.image;
        token.token = u.token;
      }
      return token;
    },

    async session({ session, token }) {
      // @ts-expect-error: session.user no incluye id por defecto, lo agregamos manualmente
      session.user.id = token.id;
      // @ts-expect-error: session.user no incluye email por defecto, lo agregamos manualmente
      session.user.email = token.email;
      // @ts-expect-error: session.user no incluye role por defecto, lo agregamos manualmente
      session.user.role = token.role;

      // @ts-expect-error: session.user no incluye lastName por defecto, lo agregamos manualmente
      session.user.lastName = token.lastName; // Agregar lastName
      // @ts-expect-error: session.user no incluye phone por defecto, lo agregamos manualmente
      session.user.phone = token.phone;       // Agregar phone
      // @ts-expect-error: session.user no incluye address por defecto, lo agregamos manualmente
      session.user.address = token.address;   // ⬅️ nuevo
      // @ts-expect-error: session.user no incluye city por defecto, lo agregamos manualmente
      session.user.city = token.city;         // ⬅️ nuevo
      // @ts-expect-error: session.user no incluye zipCode por defecto, lo agregamos manualmente
      session.user.zipCode = token.zipCode;   // ⬅️ nuevo

      session.user.name = token.name;
      // @ts-expect-error: session.user no incluye token por defecto, lo agregamos manualmente
      session.user.token = token.token || token.accessToken;

      return session;
    },
  },
  secret: process.env.JWT_SECRET,
};


export const verifyAdmin = async (req: NextRequest): Promise<DecodedToken | null> => {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;

    if (decoded.role !== 'admin') {
      return null;
    }

    return decoded;
  } catch (err) {
    return null;
  }
};

export const verifyAdminToken = (token: string): DecodedToken | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
    return decoded.role === 'admin' ? decoded : null;
  } catch {
    return null;
  }
};
