const express = require("express");
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const Goal = require('../models/goal');

// Gets data from database and load as json file
router.get('/', checkAuth, (req, res, next) => {
    Goal.find()
        .where('userId').equals(req.userData.userId)
        .sort('deadline')
        .select('_id userId title description deadline completed')
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        })
});

// Gets data from database within specified time range and load as json file
router.get('/:start([0-9]+)/:end([0-9]+)', checkAuth, (req, res, next) => {
    const startDate = new Date(Number(req.params.start));
    const endDate = new Date(Number(req.params.end));
    Goal.find()
        .where('userId').equals(req.userData.userId)
        .where('deadline').gte(startDate).lt(endDate)
        .sort('deadline')
        .select('_id userId title description deadline completed')
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        })
});

// Retrieves data from client and stores into database
router.post('/', checkAuth, (req, res, next) => {
    // Create new goal using user's post request
    const goal = new Goal({
        userId: req.userData.userId,
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
router.patch('/:goalId', checkAuth, (req, res, next) => {
    Goal.where('userId').equals(req.userData.userId)
        .update({ _id: req.params.goalId }, { $set: req.body })
        .exec()
        .then(result => {
            if (result.n < 1) {
                res.status(404).json({ message: 'Goal not found' });
            } else {
                res.status(200).json({ message: 'Goal updated' });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

// Deletes data from the database
router.delete('/:goalId', checkAuth, (req, res, next) => {
    Goal.where('userId').equals(req.userData.userId)
        .remove({ _id: req.params.goalId })
        .exec()
        .then(result => {
            if (result.n < 1) {
                res.status(404).json({ message: 'Goal not found' });
            } else {
                res.status(200).json({ message: 'Goal deleted' });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

module.exports = router;