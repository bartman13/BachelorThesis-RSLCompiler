using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using BackEnd.DataTransferObjects;
using BackEnd.Models;

namespace BackEnd.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Uzytkownicy, AuthenticateResponse>();
            CreateMap<Zgloszenia, DoctorAppResponse>();
            CreateMap<SignUpParentRequest,Uzytkownicy>();
            CreateMap<SignUpParentRequest, Uzytkownicy>();
            CreateMap<DoctorAddDecision,DecyzjeLekarza>();
            CreateMap<Szczepionki, VaccineTransfer>();
        }
    }
}