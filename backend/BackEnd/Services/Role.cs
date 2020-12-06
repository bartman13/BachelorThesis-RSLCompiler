using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;


    namespace BackEnd.Services
    {
        public enum Role
        {
            [EnumMember(Value = "Rodzic")]
            Rodzic,
            [EnumMember(Value = "Lekarz")]
            Lekarz,
            [EnumMember(Value = "PracownikPZH")]
            PracownikPZH,
            [EnumMember(Value = "Admin")]
            Admin

        }
    }

