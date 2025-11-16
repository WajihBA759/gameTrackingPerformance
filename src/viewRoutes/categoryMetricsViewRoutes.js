const express=require('express');
const router=express.Router();
const categoryMetricsViewController=require('../viewControllers/categoryMetricsViewControllers');

router.get('/metrics', categoryMetricsViewController.renderCategoryMetrics);
router.get('/categories/:categoryId/metrics', categoryMetricsViewController.renderCategoryMetricsByCategory);
module.exports=router;