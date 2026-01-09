// client/src/pages/Register.jsx
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useRef(null); // ✅ useRef

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.current.show({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Пароли не совпадают'
      });
      setLoading(false);
      return;
    }

    setTimeout(() => {
      localStorage.setItem('userRole', 'client');
      localStorage.setItem('userName', formData.name || 'Клиент');
      window.dispatchEvent(new Event('storage'));

      toast.current.show({
        severity: 'success',
        summary: 'Успешно',
        detail: `Добро пожаловать, ${formData.name}!`
      });

      setTimeout(() => {
        navigate('/cabinet', { replace: true });
      }, 1000);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="flex justify-content-center align-items-center min-h-screen p-3" style={{ backgroundColor: '#f8f9fa' }}>
      <Toast ref={toast} /> {/* ✅ */}
      <Card
        title="Регистрация"
        subTitle="Создайте аккаунт, чтобы записываться на приём"
        style={{ width: '100%', maxWidth: '400px' }}
        className="shadow-2"
        pt={{
          body: { className: 'p-4' },
          title: { className: 'text-center text-xl font-bold text-900' },
          subtitle: { className: 'text-center text-600 text-sm' }
        }}
      >
        <form onSubmit={handleSubmit}>
          <div className="field mb-4">
            <label htmlFor="name" className="block text-900 font-medium mb-2">
              Имя
            </label>
            <InputText
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Введите имя"
              className="w-full"
              autoFocus
            />
          </div>

          <div className="field mb-4">
            <label htmlFor="email" className="block text-900 font-medium mb-2">
              Email
            </label>
            <InputText
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Введите email"
              className="w-full"
            />
          </div>

          <div className="field mb-4">
            <label htmlFor="password" className="block text-900 font-medium mb-2">
              Пароль
            </label>
            <Password
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Введите пароль"
              toggleMask
              feedback={false}
              className="w-full"
            />
          </div>

          <div className="field mb-4">
            <label htmlFor="confirmPassword" className="block text-900 font-medium mb-2">
              Подтвердите пароль
            </label>
            <Password
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Повторите пароль"
              toggleMask
              feedback={false}
              className="w-full"
            />
          </div>

          <Button
            label="Зарегистрироваться"
            icon="pi pi-user-plus"
            type="submit"
            className="w-full mt-3"
            loading={loading}
          />

          <Divider align="center" className="my-4">
            <span className="text-600">или</span>
          </Divider>

          <div className="text-center">
            <span className="text-600">Уже есть аккаунт?</span>{' '}
            <Button
              label="Войти"
              text
              className="text-blue-600 font-medium"
              onClick={() => navigate('/login')}
            />
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Register;
