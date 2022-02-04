const mongoose = require('../database');
const bcrypt = require('bcryptjs');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tasks:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

projectSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
})

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
