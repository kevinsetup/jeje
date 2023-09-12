using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net;

namespace backendpedidofigueri.Utilities
{
    public class ConsumerService
    {
        public async Task<T> ConsumirAPIFormUrlencoded<T>( string BaseURL)
        {
            
            try
            {

                HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(BaseURL);
                request.Method = "GET";
                String test = String.Empty;
                using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                {
                    Stream dataStream =  response.GetResponseStream();
                    StreamReader reader =  new StreamReader(dataStream);
                    test = reader.ReadToEnd();
                    reader.Close();
                    dataStream.Close();
                }
                return  JsonConvert.DeserializeObject<T>(test);

            }
            catch (Exception ex)
            {
                throw ex;
            }
        } 
    }
}
