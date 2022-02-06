const express = require('express');
const authMiddleware = require('../middlewares/auth');// Pega a autenticação do usuário e verifica se ele tem permissão para acessar a rota

const Project = require('../models/Project');
const Task = require('../models/Task');

const router = express.Router();

router.use(authMiddleware);
// Listagem de todos os Projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().populate(['user', 'tasks']);// Populate é para trazer os dados do usuário que criou o projeto
        return res.send({ projects });
    } catch (err) {
        return res.status(400).send({error: 'Error loading projects'});
    }
});
// Listagem de um Project específico
router.get('/:projectId', async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId).populate(['user', 'tasks']);
        return res.send({ project });
    } catch (err) {
        return res.status(400).send({error: 'Error loading project'});
    }
});
// Listagem de um Project específico e delete
router.delete('/:projectId', async (req, res) => {
    try {
        await Project.findByIdAndRemove(req.params.projectId);
    } catch (err) {
        return res.status(400).send({error: 'Error deleting project'});
    }
});
// Post de um novo Project
router.post('/', async (req, res) => {
    try {
        const { title, description, tasks } = req.body;

        const project = await Project.create({ title, description, user: req.userId });

        await Promise.all(tasks.map(async task =>{
            const projectTask = new Task({ ...task, project: project._id });

            await projectTask.save();

            project.tasks.push(projectTask);
        }));

        await project.save();
        return res.send({ project });

    } catch (err) {
        return res.status(400).send({error: 'Error creating new project' + err});
    }
});

// Atualização de um Project específico
router.put('/:projectId', async (req, res) => {
    try {
        const { title, description, tasks } = req.body;

        const project = await Project.findByIdAndUpdate( req.params.projectId, {
            title,
            description
        }, { new: true } /* New retorna o novo valor, já que o mongo retornaria o antigo */);

        project.tasks = []// Limpa as tasks antigas
        await Task.remove({ project: project._id });// Remove as tasks antigas

        await Promise.all(tasks.map(async task =>{
            const projectTask = new Task({ ...task, project: project._id });

            await projectTask.save();

            project.tasks.push(projectTask);
        }));

        await project.save();
        return res.send({ project });

    } catch (err) {
        return res.status(400).send({error: 'Error editing project' + err});
    }
});

router.delete('/:projectId', async (req, res) => {
    try {
        await Project.findByIdAndRemove(req.params.projectId);
    } catch (err) {
        return res.status(400).send({error: 'Error deleting project'});
    }
});


module.exports = app => app.use('/projects', router);