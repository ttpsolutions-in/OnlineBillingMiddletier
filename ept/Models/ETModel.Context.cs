﻿//------------------------------------------------------------------------------
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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class EphraimTradersEntities : DbContext
    {
        public EphraimTradersEntities()
            : base("name=EphraimTradersEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<C__MigrationHistory> C__MigrationHistory { get; set; }
        public virtual DbSet<AspNetRole> AspNetRoles { get; set; }
        public virtual DbSet<AspNetUserClaim> AspNetUserClaims { get; set; }
        public virtual DbSet<AspNetUserLogin> AspNetUserLogins { get; set; }
        public virtual DbSet<AspNetUser> AspNetUsers { get; set; }
        public virtual DbSet<Bill> Bills { get; set; }
        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<EmployeeAccount> EmployeeAccounts { get; set; }
        public virtual DbSet<EmployeeAttendance> EmployeeAttendances { get; set; }
        public virtual DbSet<EmployeeDesignation> EmployeeDesignations { get; set; }
        public virtual DbSet<EmployeeDetail> EmployeeDetails { get; set; }
        public virtual DbSet<EmployeeRole> EmployeeRoles { get; set; }
        public virtual DbSet<EmploymentType> EmploymentTypes { get; set; }
        public virtual DbSet<Godown> Godowns { get; set; }
        public virtual DbSet<GSTPercentage> GSTPercentages { get; set; }
        public virtual DbSet<ItemCategory> ItemCategories { get; set; }
        public virtual DbSet<MaterialInventory> MaterialInventories { get; set; }
        public virtual DbSet<Material> Materials { get; set; }
        public virtual DbSet<OnlinePaymentDetail> OnlinePaymentDetails { get; set; }
        public virtual DbSet<OnlinepaymentFromWebhook> OnlinepaymentFromWebhooks { get; set; }
        public virtual DbSet<PaymentType> PaymentTypes { get; set; }
        public virtual DbSet<Right> Rights { get; set; }
        public virtual DbSet<RightsManagement> RightsManagements { get; set; }
        public virtual DbSet<SaleCategory> SaleCategories { get; set; }
        public virtual DbSet<Sale> Sales { get; set; }
        public virtual DbSet<SaleType> SaleTypes { get; set; }
        public virtual DbSet<Status> Status { get; set; }
        public virtual DbSet<SupplierRetailer> SupplierRetailers { get; set; }
        public virtual DbSet<SupplierRetailType> SupplierRetailTypes { get; set; }
        public virtual DbSet<Unit> Units { get; set; }
        public virtual DbSet<UserMaster> UserMasters { get; set; }
        public virtual DbSet<BillDetailsView> BillDetailsViews { get; set; }
        public virtual DbSet<CurrentUserRoleRightsView> CurrentUserRoleRightsViews { get; set; }
        public virtual DbSet<EmployeesForAttendance> EmployeesForAttendances { get; set; }
        public virtual DbSet<ReorderRequired> ReorderRequireds { get; set; }
        public virtual DbSet<RightsForAssignment> RightsForAssignments { get; set; }
        public virtual DbSet<RoleRightsView> RoleRightsViews { get; set; }
        public virtual DbSet<SaleQuantityAmountForReport> SaleQuantityAmountForReports { get; set; }
        public virtual DbSet<Client> Clients { get; set; }
        public virtual DbSet<RefreshToken> RefreshTokens { get; set; }
    }
}
