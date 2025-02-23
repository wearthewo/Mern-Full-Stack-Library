import Member from "../models/MemberModel.js";

export const getMembers = async (req, res) => {
  try {
    const members = await Member.find();
    res.status(200).json(members);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getMember = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Member.findById(id);
    res.status(200).json(member);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createMember = async (req, res) => {
  try {
    const member = await Member.create(req.body);
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Member.findByIdAndUpdate(id, req.body);
    res.status(200).json(member);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await Member.findByIdAndDelete(id);
    res.status(200).json(member);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
