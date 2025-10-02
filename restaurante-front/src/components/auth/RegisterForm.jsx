import { useContext, useEffect, useState } from 'react';
import { AuthContext } from "../../context/AuthContext";
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import authService from "../../services/authService.js";
import axios from 'axios';

const RegisterForm = () => {
  const { register } = useContext(AuthContext);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
  const fetchRoles = async () => {
    try {
      const response = await authService.roles();
      const roleOptions = response.data.map(role => ({ label: role, value: role }));
      setRoles(roleOptions);
    } catch (error) {
      console.error('Error fetching roles', error);
    }
  };
    fetchRoles();
  }, []);

  const initialValues = {
    name: '',
    email: '',
    password: '',
    rol: '',
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
    rol: Yup.string().required('Role is required'),
  });

  const handleSubmit = async (values) => {
    const userData = {
      nombre: values.name,
      email: values.email,
      password: values.password,
      rol: values.rol,
    };
    await register(userData);
  };

  return (
    <Card title="Register">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, values, setFieldValue }) => (
          <Form className="p-fluid">
            <div className="field p-2">
              <label htmlFor="name">Name</label>
              <InputText id="name" name="name" value={values.name} onChange={handleChange} />
              <ErrorMessage name="name" component="div" className="p-error" />
            </div>

            <div className="field p-2">
              <label htmlFor="email">Email</label>
              <InputText id="email" name="email" type="email" value={values.email} onChange={handleChange} />
              <ErrorMessage name="email" component="div" className="p-error" />
            </div>

            <div className="field p-2">
              <label htmlFor="password">Password</label>
              <Password id="password" name="password" value={values.password} onChange={handleChange} />
              <ErrorMessage name="password" component="div" className="p-error" />
            </div>

            <div className="field p-2">
              <label htmlFor="rol">Role</label>
              <Dropdown
                id="rol"
                name="rol"
                value={values.rol}
                options={roles}
                onChange={(e) => setFieldValue('rol', e.value)}
                placeholder="Select a role"
              />
              <ErrorMessage name="rol" component="div" className="p-error" />
            </div>

            <div className="field p-2">
              <Button type="submit" label="Register" className="p-button-primary" />
            </div>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default RegisterForm;
