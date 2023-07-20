using System.Security.Cryptography;
using System.Text;

namespace backendpedidofigueri.Utilities
{
    public class Crypto
    {
        private static readonly string Key = "pedidos_figueri";
        private static readonly string Iv = "1234567890123456";

        public static string EncryptRijndael(string plainData)
        {
            byte[] keyBytes = Encoding.UTF8.GetBytes(GenerateKey(Key));
            byte[] ivBytes = Encoding.UTF8.GetBytes(Iv);

            using (RijndaelManaged rijndael = new RijndaelManaged())
            {
                rijndael.Mode = CipherMode.CBC;
                rijndael.Padding = PaddingMode.PKCS7;
                rijndael.KeySize = 256;
                rijndael.BlockSize = 128;
                rijndael.Key = keyBytes;
                rijndael.IV = ivBytes;

                ICryptoTransform encryptor = rijndael.CreateEncryptor(rijndael.Key, rijndael.IV);
                byte[] encryptedBytes;

                using (MemoryStream msEncrypt = new MemoryStream())
                {
                    using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                        {
                            swEncrypt.Write(plainData);
                        }
                        encryptedBytes = msEncrypt.ToArray();
                    }
                }

                return Convert.ToBase64String(encryptedBytes);
            }
        }

        public static string DecryptRijndael(string encryptedData)
        {
            byte[] keyBytes = Encoding.UTF8.GetBytes(GenerateKey(Key));
            byte[] ivBytes = Encoding.UTF8.GetBytes(Iv);
            byte[] encryptedBytes = Convert.FromBase64String(encryptedData);

            using (RijndaelManaged rijndael = new RijndaelManaged())
            {
                rijndael.Mode = CipherMode.CBC;
                rijndael.Padding = PaddingMode.PKCS7;
                rijndael.KeySize = 256;
                rijndael.BlockSize = 128;
                rijndael.Key = keyBytes;
                rijndael.IV = ivBytes;

                ICryptoTransform decryptor = rijndael.CreateDecryptor(rijndael.Key, rijndael.IV);
                byte[] decryptedBytes;

                using (MemoryStream msDecrypt = new MemoryStream(encryptedBytes))
                {
                    using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                        {
                            decryptedBytes = Encoding.UTF8.GetBytes(srDecrypt.ReadToEnd());
                        }
                    }
                }

                return Encoding.UTF8.GetString(decryptedBytes);
            }
        }

        private static string GenerateKey(string input)
        {
            using (MD5 md5 = MD5.Create())
            {
                byte[] inputBytes = Encoding.UTF8.GetBytes(input);
                byte[] hashBytes = md5.ComputeHash(inputBytes);
                return Convert.ToBase64String(hashBytes);
            }
        }
    }
}
