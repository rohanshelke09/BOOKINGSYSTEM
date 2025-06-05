import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const LoginContainer = styled.div`
  max-width: 400px;
  margin: 60px auto;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  background-color: #ffffff;
  text-align: center;
`;

const Title = styled.h2`
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 600;
`;

const RoleButton = styled.button`
  width: 100%;
  padding: 15px;
  margin: 10px 0;
  background-color: ${props => props.$variant === 'primary' ? '#007bff' : '#6c757d'};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => props.variant === 'primary' ? '#0056b3' : '#5a6268'};
  }
`;
const ErrorMessage = styled.div`
  color: #dc3545;
  margin: 10px 0;
  padding: 10px;
  background-color: #f8d7da;
  border-radius: 4px;
  font-size: 14px;
`;
const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
`;
const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const ErrorText = styled.p`
  color: #dc3545;
  font-size: 14px;
  margin: 5px 0;
`;
const Login = () => {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState(null);
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRoleClick = (role) => {
        setSelectedRole(role);
        setError('');
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('https://localhost:7125/api/Token', {
                ...credentials,
                role: selectedRole
            });

            if (response.data.token) {
                localStorage.setItem('token', JSON.stringify({
                    token: response.data.token,
                    role: selectedRole
                }));
                localStorage.setItem('userRole', selectedRole);

                switch(selectedRole) {
                    case 'admin':
                        navigate('/admin-dashboard');
                        break;
                    case 'manager':
                        navigate('/manager-dashboard');
                        break;
                    case 'guest':
                        navigate('/guest-dashboard');
                        break;
                    default:
                        navigate('/');
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    const handleLogout = () => {
        localStorage.removeItem('userRole');
        localStorage.removeItem('token');
        setSelectedRole(null);
        setCredentials({ email: '', password: '' });
        navigate('/');
    };

    return (
        <LoginContainer>
            <Title>Welcome to Smart Hotel</Title>
            
            {!selectedRole ? (
                <>
                    <RoleButton 
                        $variant="primary"
                        onClick={() => handleRoleClick('guest')}
                    >
                        Login as Guest
                    </RoleButton>

                    <RoleButton 
                        onClick={() => handleRoleClick('manager')}
                    >
                        Login as Manager
                    </RoleButton>

                    <RoleButton 
                        onClick={() => handleRoleClick('admin')}
                    >
                        Login as Admin
                    </RoleButton>
                </>
            ) : (
                <>
                    <h3>Login as {selectedRole}</h3>
                    <LoginForm onSubmit={handleSubmit}>
                        <Input
                            type="email"
                            placeholder="Email"
                            value={credentials.email}
                            onChange={(e) => setCredentials(prev => ({
                                ...prev,
                                email: e.target.value
                            }))}
                            required
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={credentials.password}
                            onChange={(e) => setCredentials(prev => ({
                                ...prev,
                                password: e.target.value
                            }))}
                            required
                        />
                        {error && <ErrorText>{error}</ErrorText>}
                        <RoleButton 
                            type="submit"
                            $variant="primary"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </RoleButton>
                        <RoleButton 
                            type="button"
                            onClick={() => setSelectedRole(null)}
                        >
                            Back
                        </RoleButton>
                    </LoginForm>
                </>
            )}

            {localStorage.getItem('userRole') && (
                <RoleButton 
                    onClick={handleLogout}
                    style={{ backgroundColor: '#dc3545' }}
                >
                    Logout
                </RoleButton>
            )}
        </LoginContainer>
    );
};

export default Login;