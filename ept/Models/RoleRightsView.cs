//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ept.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class RoleRightsView
    {
        public short RightsId { get; set; }
        public string RightsName { get; set; }
        public byte RoleId { get; set; }
        public string RoleName { get; set; }
        public string FeatherName { get; set; }
        public string MenuUrl { get; set; }
        public string DisplayName { get; set; }
        public Nullable<short> PID { get; set; }
        public Nullable<byte> DisplayOrder { get; set; }
        public Nullable<byte> Menu { get; set; }
    }
}
