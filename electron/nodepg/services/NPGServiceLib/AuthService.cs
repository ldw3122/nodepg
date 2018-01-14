using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Management;
using System.Net;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Text;
using System.Web;

namespace WcfServiceLibrary
{
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)] 
    public class AuthService : IAuthService
    {
        public string Login(string userName, string pwd, string code)
        {
            throw new Exception("Login service has been close.");
            string url = ConfigurationManager.AppSettings.Get("Server") + "/Security/userlogin.aspx";
            string result = SendDataByPost(url, string.Format("userName={0}&pwd={1}&code={2}", userName, pwd, code));

            return result;
        }

        public Stream GetMachineCode(string loginname, string callback)
        {
            string mac = GetMacAddress();
            string url = ConfigurationManager.AppSettings.Get("Server") + "/Ashx/TimeStampServer.ashx";
            string iv = SendDataByPost(url, string.Format("ac=refresh&loginname={0}", loginname));

            string result =  Encrypt.AESEncrypt(mac, iv);

            string jsCode = callback + "({result:'" + result + "'})";

            return new MemoryStream(Encoding.UTF8.GetBytes(jsCode));
        }

        public void Auth(string sessionId)
        {
            string mac = GetMacAddress();
            string url = ConfigurationManager.AppSettings.Get("Server") + "/Ashx/TimeStampServer.ashx";
            SendDataByPost(url, string.Format("ac=auth&sessionId={0}&code={1}", sessionId, Encrypt.AESEncrypt(mac, sessionId)), sessionId);
        }

        public string GetMacAddress()
        {
            try
            {
                //获取网卡硬件地址 
                string mac = "";
                ManagementClass mc = new ManagementClass("Win32_NetworkAdapterConfiguration");
                ManagementObjectCollection moc = mc.GetInstances();
                foreach (ManagementObject mo in moc)
                {
                    if ((bool)mo["IPEnabled"] == true)
                    {
                        mac = mo["MacAddress"].ToString();
                        break;
                    }
                }
                moc = null;
                mc = null;
                return mac;
            }
            catch
            {
                return string.Empty;
            }
            finally
            {
            }
        }

        /// <summary>  
        /// 通过POST方式发送数据  
        /// </summary>  
        /// <param name="Url">url</param>  
        /// <param name="postDataStr">Post数据</param>  
        /// <param name="cookie">Cookie容器</param>  
        /// <returns></returns>  
        private string SendDataByPost(string Url, string postDataStr, string sessionId = "")
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(Url);
            request.CookieContainer = new CookieContainer();
            var cookies = new CookieCollection();

            if (!string.IsNullOrWhiteSpace(sessionId))
            {
                cookies.Add(new System.Net.Cookie("ASP.NET_SessionId", sessionId));
                cookies.Add(new System.Net.Cookie("sessionid", sessionId));
            }

            request.CookieContainer.Add(new Uri(Url), cookies);

            request.Method = "POST";
            request.ContentType = "application/x-www-form-urlencoded";  // 此处非常关键，否则网站无法接收到表单的数据。  
            request.ContentLength = postDataStr.Length;
            Stream myRequestStream = request.GetRequestStream();
            StreamWriter myStreamWriter = new StreamWriter(myRequestStream, Encoding.GetEncoding("gb2312"));
            myStreamWriter.Write(postDataStr);
            myStreamWriter.Close();

            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            Stream myResponseStream = response.GetResponseStream();
            StreamReader myStreamReader = new StreamReader(myResponseStream, Encoding.GetEncoding("gb2312"));
            string retString = myStreamReader.ReadToEnd();
            myStreamReader.Close();
            myResponseStream.Close();

            return retString;
        }
    }
}
