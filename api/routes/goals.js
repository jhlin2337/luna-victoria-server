const express = require("express");
const router = express.Router();
const Goal = require('../models/goal');

// Gets data from database and load as json file
router.get('/', (req, res, next) => {
    Goal.find()
        .select('_id title description deadline')
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        })
});

// Gets data from database within specified time range and load as json file
router.get('/:start([0-9]+)/:end([0-9]+)', (req, res, next) => {
    const startDate = new Date(Number(req.params.start));
    const endDate = new Date(Number(req.params.end));
    Goal.find()
        .where('deadline').gte(startDate).lt(endDate)
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        })
});

// Retrieves data from client and stores into database
router.post('/', (req, res, next) => {
    // Create new goal using user's post request
    const goal = new Goal({
        title: req.body.title,
        description: req.body.description,
        deadline: req.body.deadline
    });

    // Save the goal to database
    goal.save()
        .then(result => {
            res.status(201).json({
                message: 'Goal created successfully',
                createdGoal: goal
            });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

// Updates data in the database
router.patch('/:goalId', (req, res, next) => {
    Goal.update({ _id: req.params.goalId }, { $set: req.body })
        .exec()
        .then(result => {
            res.status(200).json({ message: 'Goal updated' });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

// Deletes data from the database
router.delete('/:goalId', (req, res, next) => {
    Goal.remove({ _id: req.params.goalId })
        .exec()
        .then(result => {
            res.status(200).json({ message: 'Product deleted' });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

module.exports = router;