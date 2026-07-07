const db = require('../models');
const { Op } = require('sequelize');
const Contract = db.Contract;
const Room = db.Room;
const User = db.User;
const Invoice = db.Invoice;
const Property = db.Property;
const Profile = db.Profile;
const Role = db.Role;

const createContract = async (req, res) => {
  try {
    const { room_id, tenant_email, start_date, end_date, signed_price, signed_deposit, billing_cycle } = req.body;

    const tenant = await User.findOne({ where: { email: tenant_email } });
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    const contract = await Contract.create({
      room_id,
      tenant_id: tenant.id,
      start_date,
      end_date,
      signed_price,
      signed_deposit,
      billing_cycle,
      status: 'ACTIVE'
    });

    // Update room status
    await Room.update({ status: 'RENTED' }, { where: { id: room_id } });

    res.status(201).json(contract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createInvoice = async (req, res) => {
  try {
    const { contract_id, invoice_date, service_fees } = req.body;
    
    const contract = await Contract.findByPk(contract_id);
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    // Calculate total amount = signed_price + sum(service_fees)
    let total_amount = parseFloat(contract.signed_price);
    if (service_fees) {
      Object.values(service_fees).forEach(fee => {
        total_amount += parseFloat(fee);
      });
    }

    const invoice = await Invoice.create({
      contract_id,
      invoice_date,
      total_amount,
      service_fees,
      payment_status: 'UNPAID'
    });

    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyInvoices = async (req, res) => {
  try {
    const role = req.user.Role?.role_name;
    if (!role) {
      return res.status(403).json({ message: 'User role not found' });
    }

    const { 
      page = 1, 
      limit = 10, 
      status, 
      search = '', 
      startDate, 
      endDate 
    } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (status) {
      where.payment_status = status;
    }
    if (startDate && endDate) {
      where.invoice_date = { [Op.between]: [startDate, endDate] };
    }

    const include = [
      {
        model: Contract,
        include: [
          { model: Room, include: [Property] },
          { model: User, as: 'tenant', include: [Profile] }
        ]
      }
    ];

    if (role === 'TENANT') {
      where['$Contract.tenant_id$'] = req.user.id;
    } else if (role === 'LANDLORD') {
      where['$Contract.Room.Property.landlord_id$'] = req.user.id;
    } else if (role === 'ADMIN') {
      // Admin sees everything
    }

    if (search) {
      where[Op.or] = [
        { '$Contract.tenant.email$': { [Op.like]: `%${search}%` } },
        { '$Contract.tenant.Profile.full_name$': { [Op.like]: `%${search}%` } },
        { '$Contract.Room.room_name$': { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Invoice.findAndCountAll({
      where,
      include,
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true,
      order: [['invoice_date', 'DESC'], ['id', 'DESC']]
    });

    res.json({
      data: rows,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyContracts = async (req, res) => {
  try {
    const isAdmin = req.user.Role.role_name === 'ADMIN';
    let roomIds;

    if (isAdmin) {
      const rooms = await Room.findAll({ attributes: ['id'] });
      roomIds = rooms.map(r => r.id);
    } else {
      const properties = await db.Property.findAll({
        where: { landlord_id: req.user.id }
      });
      if (properties.length === 0) return res.json([]);
      const propertyIds = properties.map(p => p.id);
      const rooms = await Room.findAll({ where: { property_id: propertyIds } });
      roomIds = rooms.map(r => r.id);
    }

    const contracts = await Contract.findAll({
      where: { 
        room_id: roomIds,
        status: 'ACTIVE'
      },
      include: [
        { model: Room },
        { model: User, as: 'tenant', include: [db.Profile] }
      ]
    });
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id, {
      include: [
        { 
          model: Contract, 
          include: [
            { model: Room, include: [Property] },
            { model: User, as: 'tenant', include: [Profile] }
          ] 
        }
      ]
    });

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Authorization check
    const role = req.user.Role.role_name;
    if (role === 'TENANT' && invoice.Contract.tenant_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (role === 'LANDLORD' && invoice.Contract.Room.Property.landlord_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 
const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status, service_fees, invoice_date } = req.body;
 
    const invoice = await Invoice.findByPk(id, {
      include: [{ model: Contract }]
    });
 
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
 
    // Authorization: Only Landauord or Admin can update
    const role = req.user.Role.role_name;
    if (role === 'LANDLORD' && invoice.Contract.Room?.Property?.landlord_id !== req.user.id) {
       // Need to be careful here, Invoice -> Contract -> Room -> Property
       // Let's reload with more associations for check
       const detailedInvoice = await Invoice.findByPk(id, {
         include: [{ model: Contract, include: [{ model: Room, include: [Property] }] }]
       });
       if (detailedInvoice.Contract.Room.Property.landlord_id !== req.user.id) {
         return res.status(403).json({ message: 'Not authorized to update this invoice' });
       }
    }
 
    const updates = {};
    if (payment_status) updates.payment_status = payment_status;
    if (invoice_date) updates.invoice_date = invoice_date;
    
    if (service_fees) {
      updates.service_fees = service_fees;
      // Recalculate total_amount
      let total_amount = parseFloat(invoice.Contract.signed_price);
      Object.values(service_fees).forEach(fee => {
        total_amount += parseFloat(fee || 0);
      });
      updates.total_amount = total_amount;
    }
 
    if (payment_status === 'PAID' && invoice.payment_status !== 'PAID') {
      updates.paid_at = new Date();
    }
 
    await invoice.update(updates);
 
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 
const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findByPk(id, {
      include: [{ model: Contract, include: [{ model: Room, include: [Property] }] }]
    });
 
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
 
    // Authorization: Only Landlord or Admin can delete
    const role = req.user.Role.role_name;
    if (role === 'LANDLORD' && invoice.Contract.Room.Property.landlord_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this invoice' });
    }
 
    await invoice.destroy();
    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 
module.exports = {
  createContract,
  createInvoice,
  getMyInvoices,
  getMyContracts,
  getInvoiceById,
  updateInvoice,
  deleteInvoice
};
