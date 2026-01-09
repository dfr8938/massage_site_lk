// client/src/pages/ForgotPassword.jsx
import { useState, useRef, useEffect } from 'react'; // ← добавлен useRef
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon'; // ✅ Правильный импорт

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();
  const toast = useRef(null); // ✅ useRef

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const startTimer = () => {
    setCanResend(false);
    setTimer(30);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (!email) {
        toast.current.show({
          severity: 'error',
          summary: 'Ошибка',
          detail: 'Введите email'
        });
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast.current.show({
          severity: 'error',
          summary: 'Ошибка',
          detail: 'Некорректный email'
        });
      } else {
        setSent(true);
        toast.current.show({
          severity: 'success',
          summary: 'Письмо отправлено',
          detail: `На ${email} отправлена ссылка для восстановления`
        });
        startTimer();
      }
      setLoading(false);
    }, 800);
  };

  const handleResend = () => {
    if (!canResend) return;

    setLoading(true);
    setTimeout(() => {
      toast.current.show({
        severity: 'success',
        summary: 'Письмо отправлено',
        detail: `Новая ссылка отправлена на ${email}`
      });
      startTimer();
      setLoading(false);
    }, 600);
  };

  return (
    <div className="flex justify-content-center align-items-center min-h-screen p-3" style={{ backgroundColor: '#f8f9fa' }}>
      <Toast ref={toast} /> {/* ✅ */}
      <Card
        title={sent ? 'Проверьте почту' : 'Восстановление пароля'}
        style={{ width: '100%', maxWidth: '400px' }}
        className="shadow-2"
        pt={{
          body: { className: 'p-4' },
          title: { className: 'text-center text-xl font-bold text-900' }
        }}
      >
        {sent ? (
          <div className="text-center">
            <i className="pi pi-envelope text-green-500 text-6xl mb-4" />
            <p className="text-600 mb-3">
              Ссылка отправлена на <strong>{email}</strong>
            </p>
            <p className="text-sm text-500 mb-5">
              Проверьте входящие и папку «Спам».
            </p>

            <Button
              label={canResend ? 'Отправить повторно' : `Через ${timer} сек`}
              icon="pi pi-send"
              className="w-full mb-3"
              disabled={!canResend}
              loading={loading}
              onClick={handleResend}
            />

            <Button
              label="Вернуться ко входу"
              icon="pi pi-arrow-left"
              text
              onClick={() => navigate('/login')}
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className="text-600 text-center mb-5 text-sm">
              Введите email — мы отправим ссылку для восстановления пароля.
            </p>

            <div className="field mb-4">
              <label htmlFor="email" className="block text-900 font-medium mb-2">
                Email
              </label>
              <IconField iconPosition="left">
                <InputIcon className="pi pi-envelope" />
                <InputText
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Введите email"
                  className="w-full"
                  autoFocus
                />
              </IconField>
            </div>

            <Button
              label="Отправить ссылку"
              icon="pi pi-send"
              type="submit"
              className="w-full mt-3"
              loading={loading}
            />

            <Divider align="center" className="my-4">
              <span className="text-600">или</span>
            </Divider>

            <div className="text-center">
              <Button
                label="Вспомнили пароль? Войти"
                text
                className="text-blue-600"
                onClick={() => navigate('/login')}
              />
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;
