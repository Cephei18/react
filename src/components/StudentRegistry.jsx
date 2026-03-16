import { useState } from 'react'
import './StudentRegistry.css'

const emptyForm = {
  name: '',
  age: '',
  email: '',
  course: '',
  grade: '',
  phone: '',
}

function validate(form) {
  const errors = {}

  // Name: required, min 3 chars
  if (!form.name.trim()) {
    errors.name = 'Full name is required.'
  } else if (form.name.trim().length < 3) {
    errors.name = 'Name must be at least 3 characters.'
  }

  // Age: required, 18–60
  if (!form.age) {
    errors.age = 'Age is required.'
  } else if (Number(form.age) < 18 || Number(form.age) > 60) {
    errors.age = 'Age must be between 18 and 60.'
  }

  // Email: required, valid format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email.trim()) {
    errors.email = 'Email address is required.'
  } else if (!emailRegex.test(form.email.trim())) {
    errors.email = 'Enter a valid email address (e.g. john@example.com).'
  }

  // Course: required, min 2 chars
  if (!form.course.trim()) {
    errors.course = 'Course name is required.'
  } else if (form.course.trim().length < 2) {
    errors.course = 'Course must be at least 2 characters.'
  }

  // Grade: required, 0–100
  if (form.grade === '') {
    errors.grade = 'Grade is required.'
  } else if (Number(form.grade) < 0 || Number(form.grade) > 100) {
    errors.grade = 'Grade must be between 0 and 100.'
  }

  // Phone: optional but if filled must be 10 digits
  if (form.phone && !/^\d{10}$/.test(form.phone.trim())) {
    errors.phone = 'Phone must be exactly 10 digits (optional).'
  }

  return errors
}

function gradeLabel(g) {
  const n = Number(g)
  if (n >= 90) return { letter: 'A' }
  if (n >= 80) return { letter: 'B' }
  if (n >= 70) return { letter: 'C' }
  if (n >= 60) return { letter: 'D' }
  if (n >= 50) return { letter: 'E' }
  return { letter: 'F' }
}

function StudentRegistry() {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // Re-validate just this field on change after first submit attempt
    if (submitted) {
      const newErrors = validate({ ...form, [name]: value })
      setErrors((prev) => ({ ...prev, [name]: newErrors[name] ?? '' }))
    }
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const newErrors = validate(form)
    setErrors((prev) => ({ ...prev, [name]: newErrors[name] ?? '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    const validationErrors = validate(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setStudents((prev) => [
      ...prev,
      { ...form, id: Date.now(), registeredAt: new Date().toLocaleString() },
    ])
    setForm(emptyForm)
    setErrors({})
    setTouched({})
    setSubmitted(false)
  }

  const fieldClass = (name) =>
    `sr-input${errors[name] ? ' invalid' : touched[name] && !errors[name] ? ' valid' : ''}`

  return (
    <div className="sr-page">
      <div className="container" style={{ maxWidth: 900 }}>

        {/* ── Page Header ── */}
        <div className="d-flex align-items-start justify-content-between mb-4 gap-3 flex-wrap">
          <div>
            <h2 className="sr-heading">Student Registry</h2>
            <p className="sr-subheading">Register students and track their course details.</p>
          </div>
          {students.length > 0 && (
            <span className="sr-count-pill">
              {students.length} Student{students.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* ── FORM CARD ── */}
        <div className="sr-card mb-4">
          <div className="sr-card-header">
            <h5 className="sr-card-title">✏️ Register New Student</h5>
          </div>
          <div className="sr-card-body">
            <form onSubmit={handleSubmit} noValidate>
              <div className="row g-3">

                {/* Name */}
                <div className="col-md-6">
                  <label className="sr-label">
                    Full Name <span className="req">*</span>
                  </label>
                  <input
                    type="text" name="name" value={form.name}
                    onChange={handleChange} onBlur={handleBlur}
                    className={fieldClass('name')} placeholder="e.g. John Doe"
                  />
                  {errors.name && <div className="sr-field-error">⚠ {errors.name}</div>}
                </div>

                {/* Age */}
                <div className="col-md-6">
                  <label className="sr-label">
                    Age <span className="req">*</span>
                    <span className="hint">(18 – 60)</span>
                  </label>
                  <input
                    type="number" name="age" value={form.age}
                    onChange={handleChange} onBlur={handleBlur}
                    className={fieldClass('age')} placeholder="e.g. 22" min="18" max="60"
                  />
                  {errors.age && <div className="sr-field-error">⚠ {errors.age}</div>}
                </div>

                {/* Email */}
                <div className="col-md-6">
                  <label className="sr-label">
                    Email Address <span className="req">*</span>
                  </label>
                  <input
                    type="email" name="email" value={form.email}
                    onChange={handleChange} onBlur={handleBlur}
                    className={fieldClass('email')} placeholder="e.g. john@example.com"
                  />
                  {errors.email && <div className="sr-field-error">⚠ {errors.email}</div>}
                </div>

                {/* Phone */}
                <div className="col-md-6">
                  <label className="sr-label">
                    Phone Number
                    <span className="hint">(optional · 10 digits)</span>
                  </label>
                  <input
                    type="tel" name="phone" value={form.phone}
                    onChange={handleChange} onBlur={handleBlur}
                    className={fieldClass('phone')} placeholder="e.g. 9876543210"
                  />
                  {errors.phone && <div className="sr-field-error">⚠ {errors.phone}</div>}
                </div>

                {/* Course */}
                <div className="col-md-6">
                  <label className="sr-label">
                    Course <span className="req">*</span>
                  </label>
                  <input
                    type="text" name="course" value={form.course}
                    onChange={handleChange} onBlur={handleBlur}
                    className={fieldClass('course')} placeholder="e.g. Computer Science"
                  />
                  {errors.course && <div className="sr-field-error">⚠ {errors.course}</div>}
                </div>

                {/* Grade */}
                <div className="col-md-6">
                  <label className="sr-label">
                    Grade (%) <span className="req">*</span>
                    <span className="hint">(0 – 100)</span>
                  </label>
                  <input
                    type="number" name="grade" value={form.grade}
                    onChange={handleChange} onBlur={handleBlur}
                    className={fieldClass('grade')} placeholder="e.g. 85" min="0" max="100"
                  />
                  {errors.grade && <div className="sr-field-error">⚠ {errors.grade}</div>}
                </div>

              </div>

              <hr className="sr-divider" />

              <div className="d-flex align-items-center gap-3 flex-wrap">
                <button type="submit" className="sr-btn sr-btn-primary">
                  Register Student
                </button>
                <button
                  type="button"
                  className="sr-btn-ghost"
                  onClick={() => {
                    setForm(emptyForm)
                    setErrors({})
                    setTouched({})
                    setSubmitted(false)
                  }}
                >
                  Clear Form
                </button>
                <span className="ms-auto" style={{ fontSize: '0.78rem', color: 'var(--sr-muted)', fontWeight: 500 }}>
                  <span style={{ color: '#e11d48' }}>*</span> Required fields
                </span>
              </div>
            </form>
          </div>
        </div>

        {/* ── TABLE ── */}
        {students.length === 0 ? (
          <div className="sr-empty">
            <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="currentColor" viewBox="0 0 16 16" className="d-block mx-auto">
              <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
            </svg>
            <strong>No students yet</strong>
            <p>Fill out the form above to register your first student.</p>
          </div>
        ) : (
          <div className="sr-card">
            <div className="sr-card-header">
              <h5 className="sr-card-title">🎓 Registered Students</h5>
              <span style={{ color: 'var(--sr-muted)', fontSize: '0.82rem', fontWeight: 500 }}>
                Click <strong style={{ color: 'var(--sr-600)' }}>View</strong> for full details
              </span>
            </div>
            <div className="sr-table-wrapper">
              <table className="sr-table">
                <thead>
                  <tr>
                    <th className="td-num">#</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Email</th>
                    <th>Course</th>
                    <th>Grade</th>
                    <th className="td-action">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => {
                    const { letter } = gradeLabel(student.grade)
                    return (
                      <tr key={student.id}>
                        <td className="td-num">{index + 1}</td>
                        <td className="td-name">{student.name}</td>
                        <td>{student.age}</td>
                        <td className="td-email">
                          <a href={`mailto:${student.email}`}>{student.email}</a>
                        </td>
                        <td>{student.course}</td>
                        <td>
                          <span className={`grade-pill grade-${letter}`}>
                            {student.grade}% · {letter}
                          </span>
                        </td>
                        <td className="td-action">
                          <button className="sr-btn-view" onClick={() => setSelectedStudent(student)}>
                            View
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── MODAL ── */}
        {selectedStudent && (() => {
          const { letter } = gradeLabel(selectedStudent.grade)
          return (
            <>
              <div className="sr-modal-backdrop" onClick={() => setSelectedStudent(null)} />
              <div className="sr-modal-wrap" role="dialog" aria-modal="true" aria-labelledby="srModalTitle">
                <div className="sr-modal-box">
                  <div className="sr-modal-head">
                    <h5 id="srModalTitle">Student Details</h5>
                    <button className="sr-modal-close" aria-label="Close" onClick={() => setSelectedStudent(null)}>×</button>
                  </div>
                  <div className="sr-modal-body-inner">
                    {[
                      ['Full Name',    selectedStudent.name],
                      ['Age',          `${selectedStudent.age} years`],
                      ['Email',        <a key="email" href={`mailto:${selectedStudent.email}`} style={{ color: 'var(--sr-500)' }}>{selectedStudent.email}</a>],
                      ['Phone',        selectedStudent.phone || '—'],
                      ['Course',       selectedStudent.course],
                      ['Grade',        <span key="grade" className={`grade-pill grade-${letter}`}>{selectedStudent.grade}% · {letter}</span>],
                      ['Registered',   selectedStudent.registeredAt],
                    ].map(([key, val]) => (
                      <div className="sr-detail-row" key={key}>
                        <span className="sr-detail-key">{key}</span>
                        <span className="sr-detail-val">{val}</span>
                      </div>
                    ))}
                  </div>
                  <div className="sr-modal-foot">
                    <button className="sr-btn-ghost" onClick={() => setSelectedStudent(null)}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </>
          )
        })()}

      </div>
    </div>
  )
}

export default StudentRegistry
