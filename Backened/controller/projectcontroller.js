import Project from "../MODELS/Project.js";
import Lead from "../MODELS/leads.js";

export const createProjectFromLead = async (req, res) => {
  try {
    const { leadId, assignedTo, service, deadline } = req.body;

    const lead = await Lead.findById(leadId);
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    const project = await Project.create({
      clientName: lead.clientName,
      service: service || lead.service,
      assignedTo,
      deadline: deadline || lead.deadline || null,
      createdBy: req.user.id,
      status: "not-started",
      progress: 0
    });

    lead.status = "closed-won";
    await lead.save();

    res.status(201).json({
      message: "Lead successfully converted to project",
      project
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const createProject = async (req, res) => {
  try {
    const {
      clientName,
      service,
      assignedTo,
      deadline
    } = req.body;

    const project = await Project.create({
      clientName,
      service,
      assignedTo,
      deadline,
      createdBy: req.user.id
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    let projects;

    if (req.user.role === "admin") {
      projects = await Project.find()
        .populate("assignedTo", "name")
        .populate("createdBy", "name");
    } else {
      projects = await Project.find({
        assignedTo: req.user._id
      })
      .populate("assignedTo", "name")
      .populate("createdBy", "name");
    }

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("assignedTo", "name")
      .populate("createdBy", "name");

    if (!project) return res.status(404).json({ message: "Not found" });

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const updateProjectStatus = async (req, res) => {
  try {
    const { status, progress } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: "Not found" });

    project.status = status || project.status;
    project.progress = progress ?? project.progress;

    await project.save();

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addProjectFile = async (req, res) => {
  try {
    const { url } = req.body;

    const project = await Project.findById(req.params.id);

    project.files.push({
      url,
      uploadedBy: req.user.name
    });

    await project.save();

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



