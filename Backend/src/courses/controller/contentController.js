const Content = require('../model/contentModel');
const Course = require('../model/courseModel');
const Section = require('../model/sectionModel');
const asyncHandler = require("express-async-handler");
const {ResponseMapper} = require("../../common/response/ResponseMapper")
const validateId = require("../../common/utils/validateId")
const {StatusCode} = require('../../common/message/StatusCode')
const {StatusMessage} = require('../../common/message/StatusMessage')
const {
    DataAlreadyExistException,
    DataNotFoundException,
    ResourceNotFoundException,
    NotPermissionException,
} = require("../../common/error/throwExceptionHandler");

const getById = asyncHandler(async (req, res) => {
    const id = req.query.id;
    const content = await Content.findById(id);
    if(content) {
        const sectionsId = content.sections;
        const listSection = await Section.find({ _id: { $in: sectionsId}})
        content.sections = listSection;
        const response = ResponseMapper.toDataResponseSuccess(content);
        res.json(response);
    } else {
        throw new DataNotFoundException(id + " does not exists");
    }
})

const update = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        const updatedContent = await Content.findByIdAndUpdate(
          id,
          {
            description: req?.body?.description,
            course: req?.body.course,
            updated: new Date().getTime()
          },
          {
            new: true
          }
        );
        const response = ResponseMapper.toDataResponseSuccess(updatedContent);
        res.json(response);
    } catch(error) {
        console.log(error);
        throw new ResourceNotFoundException(id + " does not exists in DB");
    }
})

const add = asyncHandler(async (req, res) => {
    const courseId = req?.body?.course;
    const savedCourse = await Course.findById(courseId);
    if(savedCourse) {
        const newContent = await Content.create(req.body);
        const response = ResponseMapper.toDataResponseSuccess(newContent);
        return res.json(response);
    } else {
      throw new ResourceNotFoundException("Data doesn't exists");
    }
})

module.exports = { getById, update, add }