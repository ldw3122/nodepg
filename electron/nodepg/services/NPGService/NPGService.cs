/*
 *  Nodepg Copyright (C) 2018 linlurui <rockylin@qq.com>
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.ServiceModel;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;
using WcfServiceLibrary;

namespace SognoAuthorization
{
    public partial class NPGService : ServiceBase
    {
        private static object syncRoot = new Object();//同步锁
        private ServiceHost serviceHost = null; //寄宿服务对象
        public NPGService()
        {
            InitializeComponent();
        }

        protected override void OnStart(string[] args)
        {
            try
            {
                lock (syncRoot)
                {
                    //Debugger.Launch();
                    serviceHost = new ServiceHost(typeof(AuthService));
                    if (serviceHost.State != CommunicationState.Opened)
                    {
                        serviceHost.Open();
                    }
                }
            }
            catch (Exception ex)
            {
                if (serviceHost.State == CommunicationState.Opened)
                    serviceHost.Close();

                serviceHost = null;

                System.Diagnostics.EventLog.WriteEntry("Start Sogno Service", ex.ToString(), EventLogEntryType.Error);
            }
        }

        protected override void OnStop()
        {
        }
    }
}
