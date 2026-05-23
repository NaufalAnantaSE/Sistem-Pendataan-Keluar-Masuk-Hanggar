import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN";
      name?: string | null;
      email?: string | null;
    };
  }

  interface User {
    role: "ADMIN";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "ADMIN";
  }
}
