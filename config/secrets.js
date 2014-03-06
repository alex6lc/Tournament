module.exports = {
    db: process.env.MONGOLAB_URI || 'mongodb://localhost:27017/test',

    sessionSecret: "Your Session Secret goes here",

    localAuth: true,

    sendgrid: {
        user: 'Your SendGrid Username',
        password: 'Your SendGrid Password'
    }
};
