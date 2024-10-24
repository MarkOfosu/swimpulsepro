"use client";
import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import styles from '../../styles/RegisterForm.module.css';
import WelcomeNavbar from '@app/welcome/WelcomeNavbar';
import Loader from '../../../components/elements/Loader';
import { useRouter } from 'next/navigation';
import { useUser } from '@app/context/UserContext';
import Footer from '@components/elements/Footer';

interface Team {
  id: string;
  name: string;
  location: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  swimTeam: string;
  city: string;
  country: string;
  password: string;
  confirmPassword: string;
  dateOfBirth?: string;
}

const SignupForm: React.FC<{ role: 'coach' | 'swimmer' }> = ({ role }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    swimTeam: '',
    city: '',
    country: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: role === 'swimmer' ? '' : undefined
  });

  const teamInputRef = useRef<HTMLInputElement>(null);
  const suggestionBoxRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { refreshUser } = useUser();
  const supabase = createClient();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionBoxRef.current && 
          !suggestionBoxRef.current.contains(event.target as Node) &&
          teamInputRef.current && 
          !teamInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Improved text formatting utilities
  const formatName = (str: string): string => {
    if (!str) return '';
    
    return str
      .split(/\s+/)
      .filter(word => word.length > 0)
      .map(word => {
        // Handle hyphenated words and apostrophes
        return word
          .split(/(-|')/)
          .map((part, index, array) => {
            // Don't capitalize hyphens and apostrophes
            if (part === '-' || part === "'") return part;
            // Capitalize if it's a word part
            return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
          })
          .join('');
      })
      .join(' ')
      .trim();
  };

  const formatLocation = (city: string, country: string): string => {
    const formattedCity = formatName(city);
    const formattedCountry = formatName(country);
    return `${formattedCity}, ${formattedCountry}`;
  };

  const calculateAgeGroup = (dateOfBirth: string): string => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age <= 10) return '10 & under';
    if (age <= 12) return '11-12';
    if (age <= 14) return '13-14';
    if (age <= 16) return '15-16';
    return '17-18';
  };

  const searchTeams = async (searchTerm: string) => {
    if (searchTerm.length >= 2) {
      const { data, error } = await supabase.rpc('search_teams', { 
        search_term: searchTerm 
      });
      
      if (!error && data) {
        setTeams(data);
        setShowSuggestions(true);
      }
    } else {
      setTeams([]);
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    switch (name) {
      case 'firstName':
      case 'lastName':
      case 'swimTeam':
      case 'city':
      case 'country':
        // Allow free typing, format on blur
        formattedValue = value.replace(/[^a-zA-Z\s'-]/, '');
        break;
      case 'email':
        formattedValue = value.toLowerCase();
        break;
      default:
        formattedValue = value;
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    if (name === 'swimTeam' && role === 'coach') {
      searchTeams(formattedValue);
    }
  };

  const handleNameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (['firstName', 'lastName', 'swimTeam', 'city', 'country'].includes(name)) {
      setFormData(prev => ({
        ...prev,
        [name]: formatName(value)
      }));
    }
  };

  const handleTeamSelect = (team: Team) => {
    const [city, country] = team.location.split(',').map(part => part.trim());
    
    setSelectedTeam(team);
    setFormData(prev => ({
      ...prev,
      swimTeam: formatName(team.name),
      city: formatName(city),
      country: formatName(country)
    }));
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        gender,
        swimTeam,
        city,
        country,
        dateOfBirth
      } = formData;

      // Final formatting of all text fields
      const finalFirstName = formatName(firstName);
      const finalLastName = formatName(lastName);
      const finalSwimTeam = formatName(swimTeam);
      const finalCity = formatName(city);
      const finalCountry = formatName(country);

      // Validation
      if (!finalFirstName || !finalLastName || !email || !password || !confirmPassword || 
          !gender || (role === 'coach' && (!finalSwimTeam || !finalCity || !finalCountry)) ||
          (role === 'swimmer' && !dateOfBirth)) {
        throw new Error('All fields are required');
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      if (role === 'swimmer' && dateOfBirth) {
        const birthDate = new Date(dateOfBirth);
        if (birthDate > new Date()) {
          throw new Error('Date of birth cannot be in the future');
        }
      }

      // Prepare user metadata
      let userData: any = {
        first_name: finalFirstName,
        last_name: finalLastName,
        role,
        gender
      };

      if (role === 'coach') {
        const teamData = selectedTeam ? {
          swim_team: formatName(selectedTeam.name),
          swim_team_location: selectedTeam.location
            .split(',')
            .map(part => formatName(part.trim()))
            .join(', '),
          is_team_admin: false
        } : {
          swim_team: finalSwimTeam,
          swim_team_location: formatLocation(finalCity, finalCountry),
          is_team_admin: true
        };
        userData = { ...userData, ...teamData };
      } else if (role === 'swimmer' && dateOfBirth) {
        userData = {
          ...userData,
          date_of_birth: dateOfBirth,
          age_group: calculateAgeGroup(dateOfBirth),
          last_age_group_update: new Date().toISOString().split('T')[0]
        };
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (signUpError) throw signUpError;

      if (data.session) {
        localStorage.setItem('accessToken', data.session.access_token);
        localStorage.setItem('refreshToken', data.session.refresh_token);
        localStorage.setItem('tokenExpiry', data.session.expires_at?.toString() || '');
        refreshUser();
        router.push(role === 'coach' ? '/user/coach/swimGroup' : '/user/swimmer/dashboard');
      } else {
        setError('Signup successful. Please check your email to confirm your account.');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <WelcomeNavbar />
      <div className={styles.container}>
        <div className={styles.registerBox}>
          {loading ? (
            <Loader />
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <h2 className={styles.title}>
                {formatName(role)} Registration
              </h2>

              <div className={styles.formGrid}>
                <div className={styles.inputBox}>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    onBlur={handleNameBlur}
                    placeholder=" "
                    required
                  />
                  <label>First Name</label>
                </div>

                <div className={styles.inputBox}>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    onBlur={handleNameBlur}
                    placeholder=" "
                    required
                  />
                  <label>Last Name</label>
                </div>

                <div className={styles.inputBox}>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <label>Gender</label>
                </div>

                {role === 'swimmer' && (
                  <div className={styles.inputBox}>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      max={new Date().toISOString().split('T')[0]}
                      required
                    />
                    <label>Date of Birth</label>
                  </div>
                )}

                {role === 'coach' && (
                  <>
                    <div className={styles.inputBox}>
                      <input
                        ref={teamInputRef}
                        type="text"
                        id="swimTeam"
                        name="swimTeam"
                        value={formData.swimTeam}
                        onChange={handleInputChange}
                        onBlur={handleNameBlur}
                        onFocus={() => 
                          formData.swimTeam.length >= 2 && setShowSuggestions(true)
                        }
                        placeholder=" "
                        required
                      />
                      <label>Swim Team Name</label>
                      {showSuggestions && teams.length > 0 && (
                        <div ref={suggestionBoxRef} className={styles.teamsList}>
                          {teams.map((team) => (
                            <div
                              key={team.id}
                              className={`${styles.teamItem} ${
                                selectedTeam?.id === team.id ? styles.selectedTeam : ''
                              }`}
                              onClick={() => handleTeamSelect(team)}
                            >
                              {formatName(team.name)} - {team.location.split(',').map(part => 
                                formatName(part.trim())).join(', ')}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className={styles.inputBox}>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        onBlur={handleNameBlur}
                        placeholder=" "
                        required
                      />
                      <label>City</label>
                    </div>

                    <div className={styles.inputBox}>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        onBlur={handleNameBlur}
                        placeholder=" "
                        required
                      />
                      <label>Country</label>
                    </div>
                  </>
                )}

                <div className={styles.inputBox}>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder=" "
                    required
                  />
                  <label>Email</label>
                </div>

                <div className={styles.inputBox}>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder=" "
                    minLength={8}
                    required
                  />
                  <label>Password</label>
                </div>

                <div className={styles.inputBox}>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder=" "
                    required
                  />
                  <label>Confirm Password</label>
                </div>
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button type="submit" className={styles.submitButton}>
                Register as {formatName(role)}
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SignupForm;