﻿using JWT;
using System;
using System.Security.Cryptography;
using System.Web.Configuration;

namespace AngularSql
{
    public static class Security
    {

        private static int SaltLength = 32;
        private static int HashLength = 32;
        private static int IterationCount = 1024;
        private static string JsonWebTokenKey = "3dd!370rr3$7h3M@mb0K!ngFr0mN3wY0rk";

        private static byte[] GenerateSalt()
        {
            byte[] Salt = new byte[SaltLength];
            new RNGCryptoServiceProvider().GetBytes(Salt);
            return Salt;
        }

        private static byte[] PBKDF2(string Password, byte[] Salt, int Length)
        {
            Rfc2898DeriveBytes KDF = new Rfc2898DeriveBytes(Password, Salt);
            KDF.IterationCount = IterationCount;
            return KDF.GetBytes(Length);
        }

        private static bool SlowEquals(byte[] X, byte[] Y)
        {
            uint Diff = (uint)X.Length ^ (uint)Y.Length;
            for (int I = 0; I < X.Length && I < Y.Length; I++) Diff |= (uint)(X[I] ^ Y[I]);
            return Diff == 0;
        }

        public static string EncryptPassword(string Password)
        {
            byte[] Salt = GenerateSalt();
            byte[] Hash = PBKDF2(Password, Salt, HashLength);
            return string.Format("{0}:{1}", Convert.ToBase64String(Salt), Convert.ToBase64String(Hash));
        }

        public static bool VerifyPassword(string Unencrypted, string Encrypted)
        {
            string[] Split = Encrypted.Split(":".ToCharArray());
            byte[] Salt = Convert.FromBase64String(Split[0]);
            byte[] Hash = Convert.FromBase64String(Split[1]);
            byte[] TestHash = PBKDF2(Unencrypted, Salt, Hash.Length);
            return SlowEquals(Hash, TestHash);
        }

        public static string TokenFromUserId(int UserId)
        {
            return JsonWebToken.Encode(new JsonWebTokenPayload(UserId), JsonWebTokenKey, JwtHashAlgorithm.HS512);
        }

        public static int UserIdFromToken(string Token)
        {
            return (JsonWebToken.DecodeToObject(Token, JsonWebTokenKey, true) as JsonWebTokenPayload).UserId;
        }

    }
}