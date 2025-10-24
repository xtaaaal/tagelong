import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    jwt?: string
    id?: string
  }

  interface JWT {
    jwt?: string
    id?: string
  }
}
