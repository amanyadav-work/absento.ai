const uploadImage = require("../utils/cloudinary");
const studentModel = require('../model/student')
const parentModel = require('../model/parent')



const addStudent = async (req, res) => {
    console.log(req.body);

    const { name, age, rollNo, collegeID: college, course, faceDescriptor } = req.body;
    const faceDesc = JSON.parse(faceDescriptor);
    const { email: parentEmail } = req.user;
    const { picture } = req.files;
    try {
        const imageUrl = await uploadImage(picture);
        const parentData = await parentModel.findOne({ email: parentEmail })
        const student = await studentModel.create({
            name, age, rollNo, college, course, imageUrl,
            parent: parentData._id,
            faceDescriptor: faceDesc
        })
        parentData.students.push(student._id)
        await parentData.save()
        res.status(201).send({ message: 'Student added successfully', studentId: student._id })
    } catch (error) {
        console.log('Error When Ading studentwa:', error);
        res.status(500).send({ message: 'Something Went Wrong' })
    }
}

const getStudents = async (req, res) => {
    try {
        const { id: parent } = req.query;

        if (!parent) {
            return res.status(400).json({ message: 'Parent ID is required' });
        }

        const students = await studentModel.find({ parent })
            .select('name age rollNo imageUrl college course').populate('course college')

        if (students.length === 0) {
            return res.status(404).json({ message: 'No students found for this parent' });
        }

        res.status(200).json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
};


module.exports = { addStudent, getStudents }