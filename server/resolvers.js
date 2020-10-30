import bcrypt from 'bcryptjs';
import { User, Application } from './sequelize.js';


// graphQL resolvers
const resolvers = {
  Status: {
    PLANNED: 'planned',
    APPLIED: 'applied',
    REJECTED: 'rejected',
    INTERVIEW_SCHEDULED: 'interview scheduled',
    OFFERED: 'offered',
  },
  Query: {
    currentUser: async (parent, { }, context) => {
      console.log("currentUSER query!!")
      console.log("context req user",context.getUser())
      console.log("cookies ", context.req.cookies);
      return context.getUser();
    },
    hello: async (parent, { }, context) => {
      console.log("cookies ", context.req.cookies);
      // if user not authenticated return null and status 403
      /*
      if (!context.getUser()){        
        context.res.status(403);
        return null;
      }
      */
      return 'hello world!'
    },
    getAllUsers: async () => {
      const allUsers = await User.findAll();
      return allUsers.map((user) => ({
        id: user.dataValues.id,
        username: user.dataValues.username,
        email: user.dataValues.email,
        password: user.dataValues.password,
      }));
    },
    getUserApplications: async (parent, { }, context) => {
      console.log("context req user",context.getUser())
      //console.log("context res",context.res)      
      const userApps = await Application.findAll({
        where: {
          user_id: context.getUser().id,
        },
      });
      return userApps.map((application) => ({
        id: application.dataValues.id,
        user_id: application.dataValues.user_id,
        company: application.dataValues.company,
        position: application.dataValues.position,
        url: application.dataValues.url,
        created_at: application.dataValues.created_at,
        recent_activity: application.dataValues.recent_activity,
        status: application.dataValues.status,
        notes: application.dataValues.notes,
      }));
    },
    getApplicationData: async (parent, { applicationId }) => {
      const appData = await Application.findOne({
        where: {
          id: applicationId,
        },
      });
      return appData;
    },
  },
  Mutation: {
    login: async (parent, { loginInfo }) => {
      const { username, password } = loginInfo;
      const errors = [];
      const user = await User.findOne({
        where: {
          username,
        },
      });
      const isMatch = await bcrypt.compare(password, user.dataValues.password);
      if (!isMatch) {
        errors.push('Invalid login credentials');
      }
      return { errors, user };
    },
    addUser: async (parent, { userInfo }) => {
      const { username, password, email } = userInfo;
      return bcrypt
        .hash(password, +process.env.SALT_WORK_FACTOR)
        .then(async (hash) => {
          const errors = [];
          let newUser;
          try {
            newUser = await User.create({ username, password: hash, email });
          } catch (err) {
            err.errors.forEach((error) => errors.push(error.message));
          }
          return { errors, newUser };
        })
        .catch((err) => {
          throw new Error(err.message);
        });
    },
    addApplication: async (parent, { newAppInfo }) => {
      const { user_id, company, position, url, notes, status } = newAppInfo;
      const newApp = await Application.create({ user_id, company, position, url, status, notes });
      return newApp;
    },
    editApplication: async (parent, { editedAppInfo }) => {
      const { id } = editedAppInfo;
      const updateData = {};
      Object.keys(editedAppInfo).forEach((key) => {
        if (key !== 'id') updateData[key] = editedAppInfo[key];
      });
      // eslint-disable-next-line prefer-destructuring
      updateData.recent_activity = new Date().toISOString().split('T')[0];
      console.log(updateData);
      const editedApp = await Application.update(updateData, {
        where: {
          id,
        },
        returning: true,
      });

      return editedApp[1][0].dataValues;
    },
    archiveApplication: async (parent, { id }) => {
      const archivedApp = await Application.update(
        { archive: true },
        {
          where: {
            id,
          },
          returning: true,
        }
      );
      return archivedApp[1][0].dataValues;
    },
    test: async (parent, args, context, info) => {
      const newUser = await User.create({ username: 't', password: 't', email: 't' });
      return newUser;
    },
  },
};

export { resolvers }
