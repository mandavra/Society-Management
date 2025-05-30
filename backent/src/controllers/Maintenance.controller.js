const maintenanceService = require("../services/maintenance.service");
const Payment = require("../models/Payment.model");
const Maintenance = require("../models/Maintenance.model");
const mongoose = require("mongoose");
const Resident = require("../models/resident.model");
// Create a new maintenance record
const createMaintenance = async (req, res) => {
  try {
    const reqbody = req.body;
    console.log("🚀 ~ createMaintenance ~ reqbody:", reqbody);
    const bosy = {
      Maintenance_Amount: reqbody.Maintenance_Amount,
      Penalty_Amount: reqbody.Penalty_Amount,
      Maintenance_Due_Date: reqbody.Maintenance_Due_Date,
      Penalty_Applied_After_Day_Selection:
        reqbody.Penalty_Applied_After_Day_Selection,
      createdBy: req.user._id,
      Society: req.user.societyid,
    };
    const maintenance = await maintenanceService.create(bosy);
    return res.status(201).json(maintenance);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Get all maintenance records
const getAllMaintenances = async (req, res) => {
  try {
    const societyid = req.user.societyid;

    // 1. Get all Maintenance records for the society
    const maintenances = await Maintenance.find({ Society: societyid }).populate("createdBy");
    console.log("Maintenances found:", maintenances.length, maintenances.map(m => m._id.toString()));

    // 2. Get all Payment records for the society with paymenttype: "Maintenance"
    const payments = await Payment.find({
      societyid: societyid,
      paymenttype: "Maintenance",
    })
      .populate("residentid")
      .select("incomeId haspaid residentid paymentMethod");
    console.log("Payments found:", payments.length, payments.map(p => ({
      incomeId: p.incomeId?.toString(),
      residentid: p.residentid?._id?.toString(),
      haspaid: p.haspaid,
      paymentMethod: p.paymentMethod
    })));

    // 3. Create a map of payments by maintenance ID
    const paymentMap = {};
    payments.forEach(payment => {
      if (!payment.incomeId || !mongoose.Types.ObjectId.isValid(payment.incomeId)) {
        console.warn("Invalid incomeId in payment:", payment._id, payment.incomeId);
        return;
      }
      const maintenanceId = payment.incomeId.toString();
      paymentMap[maintenanceId] = {
        haspaid: payment.haspaid,
        resident: payment.residentid || {},
        paymentMethod: payment.paymentMethod || "N/A",
      };
    });
    console.log("Payment map keys:", Object.keys(paymentMap));

    // 4. Enrich maintenance records with payment status and resident details
    const enrichedMaintenances = maintenances.map(maintenance => {
      const maintenanceId = maintenance._id.toString();
      const payment = paymentMap[maintenanceId];
      const resident = payment?.resident || {};

      console.log("🚀 ~ getAllMaintenances ~ resident:", resident.Fullname)
      return {
        _id: maintenance._id,
        Maintenance_Amount: maintenance.Maintenance_Amount,
        Penalty_Amount: maintenance.Penalty_Amount,
        Maintenance_Due_Date: maintenance.Maintenance_Due_Date,
        Penalty_Applied_After_Day_Selection: maintenance.Penalty_Applied_After_Day_Selection,
        createdBy: maintenance.createdBy,
        Society: maintenance.Society,
        createdAt: maintenance.createdAt,
        updatedAt: maintenance.updatedAt,
        paymentstatus: payment?.haspaid ? "Done" : "Pending",
        name: resident.Fullname || "N/A",
        phone: resident.Phone || "N/A",
        unit: resident.Unit || "N/A",
        unit_Num: resident.Wing || "N/A",
        status: resident.status || "Owner",
        paymentMethod: payment?.paymentMethod || "N/A",
        img: resident.residentphoto || "https://via.placeholder.com/40",
      };
    });

    return res.status(200).json({
      message: "Allmaintenances",
      maintenances: enrichedMaintenances,
    });
  } catch (error) {
    console.error("Error fetching maintenances:", error);
    return res.status(500).json({ message: error.message });
  }
};

const getMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const maintenance = await maintenanceService.getById(id);
    if (!maintenance) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json(maintenance);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update a maintenance record
const updateMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const maintenance = await maintenanceService.getById(id);
    if (!maintenance) {
      return res.status(404).json({ message: "Not found" });
    }
    const body = {};
    if (req.body) {
      body.Maintenance_Amount = req.body.Maintenance_Amount;
      body.Penalty_Amount = req.body.Penalty_Amount;
      body.Maintenance_Due_Date = req.body.Maintenance_Due_Date;
      body.Penalty_Applied_After_Day_Selection =
        req.body.Penalty_Applied_After_Day_Selection;
    }

    const updatedMaintenance = await maintenanceService.update(id, body);
    return res.status(200).json(updatedMaintenance);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Delete a maintenance record
const deleteMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const maintenance = await maintenanceService.getById(id);
    if (!maintenance) {
      return res.status(404).json({ message: "Already deleted" });
    }

    await maintenanceService.remove(id);
    return res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMaintenanceStatus = async (req, res) => {
  const residentId = req.user._id;
  console.log("🚀 ~ getMaintenanceStatus ~ residentId:", residentId)
  const societyId = req.user.societyid;
  console.log("🚀 ~ getMaintenanceStatus ~ societyId:", societyId)

  try {
    // 1. Get all Maintenance for this Society
    const allMaintenances = await Maintenance.find({ Society: societyId });
    if (!allMaintenances.length) {
      return res.status(200).json({
        message: "No maintenance records found for this society",
        paid: [],
        pending: [],
      });
    }

    // 2. Get ALL Maintenance Payments for this user (both paid and unpaid)
    const payments = await Payment.find({
      residentid: residentId,
      societyid: societyId,
      paymenttype: "Maintenance",
    }).select("incomeId haspaid");

    // Debug: Log all payments
    console.log("All Payments:", payments);

    // 3. Create maps for paid and unpaid payments
    const paidIds = new Set();
    const unpaidIds = new Set();

    payments.forEach(payment => {
      if (!mongoose.Types.ObjectId.isValid(payment.incomeId)) {
        console.warn("Invalid incomeId:", payment.incomeId);
        return;
      }
      const incomeIdStr = payment.incomeId.toString();
      if (payment.haspaid) {
        paidIds.add(incomeIdStr);
      } else {
        unpaidIds.add(incomeIdStr);
      }
    });

    console.log("Paid IDs:", [...paidIds]);
    console.log("Unpaid IDs:", [...unpaidIds]);

    // 4. Separate into Paid & Pending
    const paidMaintenances = [];
    const pendingMaintenances = [];

    allMaintenances.forEach(maintenance => {
      const maintenanceId = maintenance._id.toString();
      console.log("Checking Maintenance ID:", maintenanceId);

      if (paidIds.has(maintenanceId)) {
        console.log(`Maintenance ${maintenanceId} is PAID`);
        paidMaintenances.push(maintenance);
      } else {
        console.log(`Maintenance ${maintenanceId} is PENDING`);
        pendingMaintenances.push(maintenance);
      }
    });

    return res.status(200).json({
      message: "Maintenance status fetched",
      paid: paidMaintenances,
      pending: pendingMaintenances,
    });
  } catch (err) {
    console.error("ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
};


const getPendingMaintenances = async (req, res) => {
  try {
    const societyId = req.user.societyid;

    // 1. Fetch all residents
    const allResidents = await Resident.find({
      Society: societyId
    }).select('_id Fullname Email Phone Unit Wing residentphoto');

    // 2. Fetch all maintenance records
    const maintenanceRecords = await Maintenance.find({
      Society: societyId
    }).select('Maintenance_Amount _id');

    // 3. Fetch all payment records for maintenance
    const paymentRecords = await Payment.find({
      societyid: societyId,
      paymenttype: "Maintenance",
    }).select('residentid maintenanceid haspaid');

    // 4. Build a map of payments for each resident
    const paymentMap = new Map();
    paymentRecords.forEach(record => {
      if (record.residentid && record.maintenanceid) {
        const residentId = record.residentid.toString();
        const maintenanceId = record.maintenanceid.toString();
        
        if (!paymentMap.has(residentId)) {
          paymentMap.set(residentId, []);
        }
        paymentMap.get(residentId).push({ maintenanceId, hasPaid: record.haspaid });
      }
    });

    // 5. Final logic for calculating pending maintenance and amounts
    const pendingResidents = [];

    for (const resident of allResidents) {
      const residentId = resident._id ? resident._id.toString() : null;
      if (!residentId) continue; // Skip if resident ID is missing

      let pendingMaintenances = 0;
      let totalPendingAmount = 0;

      // 6. Check each maintenance record for payments
      maintenanceRecords.forEach(maintenance => {
        const maintenanceId = maintenance._id.toString();
        const maintenanceAmount = maintenance.Maintenance_Amount;

        // If there's no payment record for this resident or the payment is not marked as paid
        const payment = paymentMap.get(residentId)?.find(p => p.maintenanceId === maintenanceId);

        // Check if the payment is not marked as paid (hasPaid === false or undefined)
        if (!payment || payment.hasPaid === false) {
          pendingMaintenances++;
          totalPendingAmount += maintenanceAmount;
        }
      });

      // If there are pending maintenance, add the resident to the pending list
      if (pendingMaintenances > 0) {
        pendingResidents.push({
          residentId: resident._id,
          fullname: resident.Fullname,
          phone: resident.Phone,
          email: resident.Email,
          wing: resident.Wing,
          unit: resident.Unit,
          residentphoto: resident.residentphoto,
          pendingMaintenances,
          pendingAmount: totalPendingAmount,  // Total amount for pending maintenance
        });
      }
    }

    res.status(200).json({
      success: true,
      totalPendingMembers: pendingResidents.length,
      pendingMembers: pendingResidents
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};



module.exports = {
  createMaintenance,
  getAllMaintenances,
  updateMaintenance,
  deleteMaintenance,
  getMaintenance,
  getMaintenanceStatus,
  getPendingMaintenances
};
