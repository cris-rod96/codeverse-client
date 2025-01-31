import { useState } from 'react'
import { validationService } from 'services/index.services'
import { usersAPI } from 'api/index.api'

const useRecoveryPassword = (setLoading) => {
  const [selectedField, setSelectedField] = useState(null)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const handleChange = (field, value) => {
    if (field === 'email') setEmail(value)
    if (field === 'phone') setPhone(value)

    if (value.trim().length > 0) {
      setSelectedField(field)
    } else {
      setSelectedField(null)
    }
  }

  const onSubmit = () => {
    if (selectedField === null) {
      return {
        ok: false,
        toast: 'error',
        title: 'Error',
        message: 'Por favor, seleccione un campo.',
      }
    }

    if (selectedField === 'email') {
      if (email.trim() === '') {
        return {
          ok: false,
          toast: 'error',
          title: 'Error',
          message: 'Por favor, ingrese un correo electrónico válido.',
        }
      } else {
        const { isValid, message } = validationService.determineUserType(email)
        if (!isValid) {
          return {
            ok: false,
            toast: 'error',
            title: 'Error',
            message: message,
          }
        }
      }
    }

    if (selectedField === 'phone' && phone.trim() === '') {
      return {
        ok: false,
        toast: 'error',
        title: 'Error',
        message: 'Por favor, ingrese un número de teléfono válido.',
      }
    }

    const data =
      selectedField === 'email'
        ? {
            method: 'Email',
            value: email,
          }
        : {
            method: 'SMS',
            value: phone,
          }

    setLoading(true)

    return usersAPI
      .recoveryPassword(data)
      .then((res) => {
        const { message } = res.data
        return {
          ok: true,
          toast: 'success',
          title: `Código enviado vía ${data.method} `,
          message,
          method: data.method,
          value: data.value,
        }
      })
      .catch((err) => {
        const { message } = err.response.data
        return {
          ok: false,
          toast: 'error',
          title: 'Error',
          message,
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return { handleChange, onSubmit }
}

export default useRecoveryPassword
