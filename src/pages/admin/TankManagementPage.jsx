import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import api from '../../api/axios'

import './TankManagementPage.css'


const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://127.0.0.1:8000'


function TankManagementPage() {
  const navigate = useNavigate()

  const fileInputRefs = useRef({})
  const imageSectionRefs = useRef({})

  const [tanks, setTanks] = useState([])
  const [includeInactive, setIncludeInactive] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [editingTankId, setEditingTankId] = useState(null)

  const [showTankForm, setShowTankForm] = useState(false)

  const [openImageTankId, setOpenImageTankId] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    capacity_liters: '',
    availability: 'In Stock',
    is_active: true,
  })

  const [tankImages, setTankImages] = useState({})
  const [loadingImages, setLoadingImages] = useState({})
  const [uploadingImages, setUploadingImages] = useState({})
  const [deletingImages, setDeletingImages] = useState({})


  const getToken = () => {
    return localStorage.getItem(
      'kentank_admin_token'
    )
  }


  const handleUnauthorized = () => {
    localStorage.removeItem(
      'kentank_admin_token'
    )

    localStorage.removeItem(
      'kentank_admin_token_type'
    )

    navigate(
      '/kentankd/login',
      { replace: true }
    )
  }


  const getAuthConfig = () => {
    const token = getToken()

    const tokenType =
      localStorage.getItem(
        'kentank_admin_token_type'
      ) || 'bearer'

    return {
      headers: {
        Authorization: `${tokenType} ${token}`,
      },
    }
  }


  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      return ''
    }

    if (
      imageUrl.startsWith('http://') ||
      imageUrl.startsWith('https://')
    ) {
      return imageUrl
    }

    return `${API_BASE_URL}${imageUrl}`
  }


  const fetchTanks = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await api.get(
        '/kentankd/tanks',
        {
          params: {
            include_inactive: includeInactive,
          },
          ...getAuthConfig(),
        }
      )

      setTanks(response.data)

    } catch (err) {
      console.error(
        'Failed to load tanks:',
        err
      )

      if (err.response?.status === 401) {
        handleUnauthorized()
        return
      }

      setError(
        'Unable to load water tanks.'
      )

    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    fetchTanks()
  }, [includeInactive])


  /*
    Automatically scroll to the opened image gallery.

    The small delay allows React to finish rendering
    the gallery before scrollIntoView is called.
  */
  useEffect(() => {
    if (openImageTankId === null) {
      return
    }

    const timer = setTimeout(() => {
      const imageSection =
        imageSectionRefs.current[
          openImageTankId
        ]

      if (imageSection) {
        imageSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    }, 100)

    return () => {
      clearTimeout(timer)
    }
  }, [openImageTankId])


  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      capacity_liters: '',
      availability: 'In Stock',
      is_active: true,
    })

    setEditingTankId(null)
  }


  const closeTankForm = () => {
    resetForm()
    setShowTankForm(false)
  }


  const openCreateForm = () => {
    resetForm()
    setShowTankForm(true)
    setOpenImageTankId(null)

    setError('')
    setSuccess('')

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }


  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target

    setFormData((previousData) => ({
      ...previousData,
      [name]:
        type === 'checkbox'
          ? checked
          : value,
    }))

    if (error) {
      setError('')
    }

    if (success) {
      setSuccess('')
    }
  }


  const handleSubmit = async (event) => {
    event.preventDefault()

    setSaving(true)
    setError('')
    setSuccess('')

    const payload = {
      name: formData.name.trim(),
      price: Number(formData.price),
      description:
        formData.description.trim() || null,
      capacity_liters:
        Number(formData.capacity_liters),
      availability:
        formData.availability,
      is_active:
        formData.is_active,
    }

    try {
      if (editingTankId) {
        await api.put(
          `/kentankd/tanks/${editingTankId}`,
          payload,
          getAuthConfig()
        )

        setSuccess(
          'Water tank updated successfully.'
        )

      } else {
        await api.post(
          '/kentankd/tanks',
          payload,
          getAuthConfig()
        )

        setSuccess(
          'Water tank created successfully.'
        )
      }

      resetForm()
      setShowTankForm(false)

      await fetchTanks()

    } catch (err) {
      console.error(
        'Failed to save tank:',
        err
      )

      if (err.response?.status === 401) {
        handleUnauthorized()
        return
      }

      if (err.response?.status === 422) {
        setError(
          'Please check the information entered and try again.'
        )
      } else {
        setError(
          'Unable to save the water tank.'
        )
      }

    } finally {
      setSaving(false)
    }
  }


  const handleEdit = (tank) => {
    setEditingTankId(tank.id)

    setFormData({
      name: tank.name || '',
      price: tank.price || '',
      description:
        tank.description || '',
      capacity_liters:
        tank.capacity_liters || '',
      availability:
        tank.availability || 'In Stock',
      is_active:
        tank.is_active,
    })

    setShowTankForm(true)
    setOpenImageTankId(null)

    setError('')
    setSuccess('')

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }


  const handleDelete = async (tankId) => {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete this water tank and its images?'
    )

    if (!confirmed) {
      return
    }

    setError('')
    setSuccess('')

    try {
      await api.delete(
        `/kentankd/tanks/${tankId}`,
        getAuthConfig()
      )

      if (editingTankId === tankId) {
        closeTankForm()
      }

      if (openImageTankId === tankId) {
        setOpenImageTankId(null)
      }

      setSuccess(
        'Water tank deleted successfully.'
      )

      await fetchTanks()

    } catch (err) {
      console.error(
        'Failed to delete tank:',
        err
      )

      if (err.response?.status === 401) {
        handleUnauthorized()
        return
      }

      setError(
        'Unable to delete the water tank.'
      )
    }
  }


  const toggleActive = async (tank) => {
    setError('')
    setSuccess('')

    try {
      await api.put(
        `/kentankd/tanks/${tank.id}`,
        {
          is_active: !tank.is_active,
        },
        getAuthConfig()
      )

      setSuccess(
        tank.is_active
          ? 'Tank deactivated successfully.'
          : 'Tank activated successfully.'
      )

      await fetchTanks()

    } catch (err) {
      console.error(
        'Failed to update tank status:',
        err
      )

      if (err.response?.status === 401) {
        handleUnauthorized()
        return
      }

      setError(
        'Unable to update tank status.'
      )
    }
  }


  const fetchImages = async (tankId) => {
    setLoadingImages((previous) => ({
      ...previous,
      [tankId]: true,
    }))

    try {
      const response = await api.get(
        `/kentankd/tanks/${tankId}/images`,
        getAuthConfig()
      )

      setTankImages((previous) => ({
        ...previous,
        [tankId]: response.data,
      }))

    } catch (err) {
      console.error(
        'Failed to load tank images:',
        err
      )

      if (err.response?.status === 401) {
        handleUnauthorized()
        return
      }

      setError(
        'Unable to load tank images.'
      )

    } finally {
      setLoadingImages((previous) => ({
        ...previous,
        [tankId]: false,
      }))
    }
  }


  const handleImageSectionOpen = async (tankId) => {
    if (openImageTankId === tankId) {
      setOpenImageTankId(null)
      return
    }

    setError('')
    setSuccess('')

    setOpenImageTankId(tankId)

    if (
      Object.prototype.hasOwnProperty.call(
        tankImages,
        tankId
      )
    ) {
      return
    }

    await fetchImages(tankId)
  }


  const handleImageUpload = async (
    tankId,
    event
  ) => {
    const files = Array.from(
      event.target.files || []
    )

    if (!files.length) {
      return
    }

    setError('')
    setSuccess('')

    setUploadingImages((previous) => ({
      ...previous,
      [tankId]: true,
    }))

    try {
      for (const file of files) {
        const formData = new FormData()

        formData.append(
          'file',
          file
        )

        await api.post(
          `/kentankd/tanks/${tankId}/images/upload`,
          formData,
          {
            headers: {
              Authorization:
                `Bearer ${getToken()}`,
              'Content-Type':
                'multipart/form-data',
            },
          }
        )
      }

      setSuccess(
        files.length === 1
          ? 'Tank image uploaded successfully.'
          : `${files.length} tank images uploaded successfully.`
      )

      await fetchImages(tankId)

      /*
        Collapse the image gallery after
        a successful upload.
      */
      setOpenImageTankId(null)

    } catch (err) {
      console.error(
        'Failed to upload tank image:',
        err
      )

      if (err.response?.status === 401) {
        handleUnauthorized()
        return
      }

      setError(
        err.response?.data?.detail ||
        'Unable to upload tank image.'
      )

    } finally {
      setUploadingImages((previous) => ({
        ...previous,
        [tankId]: false,
      }))

      if (
        fileInputRefs.current[tankId]
      ) {
        fileInputRefs.current[
          tankId
        ].value = ''
      }
    }
  }


  const handleDeleteImage = async (
    tankId,
    imageId
  ) => {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete this image?'
    )

    if (!confirmed) {
      return
    }

    setError('')
    setSuccess('')

    setDeletingImages((previous) => ({
      ...previous,
      [imageId]: true,
    }))

    try {
      await api.delete(
        `/kentankd/tanks/images/${imageId}`,
        getAuthConfig()
      )

      setTankImages((previous) => ({
        ...previous,
        [tankId]: (
          previous[tankId] || []
        ).filter(
          (image) =>
            image.id !== imageId
        ),
      }))

      setSuccess(
        'Tank image deleted successfully.'
      )

    } catch (err) {
      console.error(
        'Failed to delete tank image:',
        err
      )

      if (err.response?.status === 401) {
        handleUnauthorized()
        return
      }

      setError(
        err.response?.data?.detail ||
        'Unable to delete tank image.'
      )

    } finally {
      setDeletingImages((previous) => ({
        ...previous,
        [imageId]: false,
      }))
    }
  }


  const filteredTanks = useMemo(() => {
    const normalizedSearch =
      searchTerm
        .trim()
        .toLowerCase()

    if (!normalizedSearch) {
      return tanks
    }

    return tanks.filter((tank) =>
      [
        tank.name,
        tank.capacity_liters,
        tank.availability,
        tank.description,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)
    )
  }, [
    tanks,
    searchTerm,
  ])


  const formatPrice = (price) => {
    return new Intl.NumberFormat(
      'en-KE',
      {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 2,
      }
    ).format(price)
  }


  return (
    <div className="kentank-tank-management">

      <div className="tank-management-header">

        <div>
          <span className="admin-section-label">
            PRODUCT MANAGEMENT
          </span>

          <h1>
            Water Tanks
          </h1>

          <p>
            Create, manage, update and organize
            the water tanks displayed on your
            website.
          </p>
        </div>

        {!showTankForm && (
          <button
            type="button"
            className="tank-primary-button"
            onClick={openCreateForm}
          >
            <i className="bi bi-plus-lg"></i>
            Add New Tank
          </button>
        )}

      </div>


      {error && (
        <div className="tank-alert tank-alert-error">
          <i className="bi bi-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      )}


      {success && (
        <div className="tank-alert tank-alert-success">
          <i className="bi bi-check-circle"></i>
          <span>{success}</span>
        </div>
      )}


      {showTankForm && (
        <div className="tank-form-card">

          <div className="tank-card-heading">

            <div>
              <h2>
                {editingTankId
                  ? 'Edit Water Tank'
                  : 'Add New Water Tank'}
              </h2>

              <p>
                Enter the product information
                that customers will see.
              </p>
            </div>

            <button
              type="button"
              className="tank-cancel-button"
              onClick={closeTankForm}
              disabled={saving}
            >
              {editingTankId
                ? 'Cancel Editing'
                : 'Close'}
            </button>

          </div>


          <form
            onSubmit={handleSubmit}
            className="tank-form"
          >

            <div className="tank-form-grid">

              <div className="tank-form-group">
                <label htmlFor="tank-name">
                  Tank Name
                </label>

                <input
                  id="tank-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Kentank 5000L"
                  required
                  disabled={saving}
                />
              </div>


              <div className="tank-form-group">
                <label htmlFor="tank-price">
                  Price (KES)
                </label>

                <input
                  id="tank-price"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. 45000"
                  min="0.01"
                  step="0.01"
                  required
                  disabled={saving}
                />
              </div>


              <div className="tank-form-group">
                <label htmlFor="tank-capacity">
                  Capacity (Litres)
                </label>

                <input
                  id="tank-capacity"
                  type="number"
                  name="capacity_liters"
                  value={
                    formData.capacity_liters
                  }
                  onChange={handleChange}
                  placeholder="e.g. 5000"
                  min="1"
                  required
                  disabled={saving}
                />
              </div>


              <div className="tank-form-group">
                <label htmlFor="tank-availability">
                  Availability
                </label>

                <select
                  id="tank-availability"
                  name="availability"
                  value={
                    formData.availability
                  }
                  onChange={handleChange}
                  disabled={saving}
                >
                  <option value="In Stock">
                    In Stock
                  </option>

                  <option value="Limited Stock">
                    Limited Stock
                  </option>

                  <option value="Out of Stock">
                    Out of Stock
                  </option>
                </select>
              </div>


              <div className="tank-form-group tank-form-full">
                <label htmlFor="tank-description">
                  Description
                </label>

                <textarea
                  id="tank-description"
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={handleChange}
                  placeholder="Describe the water tank..."
                  rows="4"
                  disabled={saving}
                />
              </div>


              <div className="tank-form-group tank-form-full">

                <label className="tank-checkbox-label">

                  <input
                    type="checkbox"
                    name="is_active"
                    checked={
                      formData.is_active
                    }
                    onChange={handleChange}
                    disabled={saving}
                  />

                  <span>
                    Display this tank on
                    the public website
                  </span>

                </label>

              </div>

            </div>


            <div className="tank-form-actions">

              <button
                type="submit"
                className="tank-primary-button"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="tank-spinner"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg"></i>

                    {editingTankId
                      ? 'Update Tank'
                      : 'Create Tank'}
                  </>
                )}
              </button>


              {editingTankId && (
                <button
                  type="button"
                  className="tank-secondary-button"
                  onClick={() => {
                    resetForm()
                    setError('')
                    setSuccess('')
                  }}
                  disabled={saving}
                >
                  Reset
                </button>
              )}

            </div>

          </form>

        </div>
      )}


      <div className="tank-list-card">

        <div className="tank-list-header">

          <div>
            <h2>
              Tank Inventory
            </h2>

            <p>
              Manage your products and
              their image galleries.
            </p>
          </div>

          <div className="tank-list-controls">

            <div className="tank-search-box">
              <i className="bi bi-search"></i>

              <input
                type="search"
                placeholder="Search tanks..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
              />
            </div>


            <label className="tank-toggle-label">

              <input
                type="checkbox"
                checked={includeInactive}
                onChange={(event) =>
                  setIncludeInactive(
                    event.target.checked
                  )
                }
              />

              <span>
                Show inactive
              </span>

            </label>

          </div>

        </div>


        {loading ? (
          <div className="tank-loading-state">
            <span className="tank-spinner"></span>
            Loading tanks...
          </div>
        ) : filteredTanks.length === 0 ? (
          <div className="tank-empty-state">

            <i className="bi bi-box-seam"></i>

            <h3>
              No water tanks found
            </h3>

            <p>
              Create your first water tank
              to begin managing your inventory.
            </p>

          </div>
        ) : (
          <div className="tank-table-wrapper">

            <table className="tank-table">

              <thead>
                <tr>
                  <th>Tank</th>
                  <th>Capacity</th>
                  <th>Price</th>
                  <th>Availability</th>
                  <th>Status</th>
                  <th>Images</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredTanks.map((tank) => {

                  const images =
                    tankImages[tank.id] || []

                  return (
                    <tr key={tank.id}>

                      <td>
                        <div className="tank-name-cell">

                          <strong>
                            {tank.name}
                          </strong>

                          <span>
                            ID #{tank.id}
                          </span>

                        </div>
                      </td>


                      <td>
                        {Number(
                          tank.capacity_liters
                        ).toLocaleString()} L
                      </td>


                      <td>
                        <strong className="tank-price">
                          {formatPrice(
                            tank.price
                          )}
                        </strong>
                      </td>


                      <td>
                        <span
                          className={`tank-availability-badge ${
                            tank.availability ===
                            'In Stock'
                              ? 'in-stock'
                              : tank.availability ===
                                'Limited Stock'
                              ? 'limited-stock'
                              : 'out-stock'
                          }`}
                        >
                          {tank.availability}
                        </span>
                      </td>


                      <td>
                        <span
                          className={
                            tank.is_active
                              ? 'tank-status-active'
                              : 'tank-status-inactive'
                          }
                        >
                          <span></span>

                          {tank.is_active
                            ? 'Active'
                            : 'Inactive'}
                        </span>
                      </td>


                      <td>

                        <button
                          type="button"
                          className="tank-image-button"
                          onClick={() =>
                            handleImageSectionOpen(
                              tank.id
                            )
                          }
                        >
                          <i
                            className={
                              openImageTankId === tank.id
                                ? 'bi bi-chevron-up'
                                : 'bi bi-images'
                            }
                          ></i>

                          {openImageTankId === tank.id
                            ? 'Hide Images'
                            : Object.prototype.hasOwnProperty.call(
                                tankImages,
                                tank.id
                              )
                            ? `${images.length} ${
                                images.length === 1
                                  ? 'Image'
                                  : 'Images'
                              }`
                            : 'Manage Images'}
                        </button>

                      </td>


                      <td>

                        <div className="tank-action-buttons">

                          <button
                            type="button"
                            className="tank-action-edit"
                            onClick={() =>
                              handleEdit(tank)
                            }
                            title="Edit tank"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>


                          <button
                            type="button"
                            className="tank-action-status"
                            onClick={() =>
                              toggleActive(tank)
                            }
                            title={
                              tank.is_active
                                ? 'Deactivate tank'
                                : 'Activate tank'
                            }
                          >
                            <i
                              className={
                                tank.is_active
                                  ? 'bi bi-eye-slash'
                                  : 'bi bi-eye'
                              }
                            ></i>
                          </button>


                          <button
                            type="button"
                            className="tank-action-delete"
                            onClick={() =>
                              handleDelete(
                                tank.id
                              )
                            }
                            title="Delete tank"
                          >
                            <i className="bi bi-trash"></i>
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                })}

              </tbody>

            </table>


            <div className="tank-mobile-list">

              {filteredTanks.map((tank) => {

                const images =
                  tankImages[tank.id] || []

                return (
                  <div
                    className="tank-mobile-card"
                    key={tank.id}
                  >

                    <div className="tank-mobile-card-header">

                      <div>
                        <strong>
                          {tank.name}
                        </strong>

                        <span>
                          ID #{tank.id}
                        </span>
                      </div>

                      <span
                        className={
                          tank.is_active
                            ? 'tank-status-active'
                            : 'tank-status-inactive'
                        }
                      >
                        <span></span>

                        {tank.is_active
                          ? 'Active'
                          : 'Inactive'}
                      </span>

                    </div>


                    <div className="tank-mobile-details">

                      <div>
                        <span>
                          Capacity
                        </span>

                        <strong>
                          {Number(
                            tank.capacity_liters
                          ).toLocaleString()} L
                        </strong>
                      </div>


                      <div>
                        <span>
                          Price
                        </span>

                        <strong>
                          {formatPrice(
                            tank.price
                          )}
                        </strong>
                      </div>


                      <div>
                        <span>
                          Availability
                        </span>

                        <strong>
                          {tank.availability}
                        </strong>
                      </div>

                    </div>


                    <button
                      type="button"
                      className="tank-image-button tank-mobile-image-button"
                      onClick={() =>
                        handleImageSectionOpen(
                          tank.id
                        )
                      }
                    >
                      <i
                        className={
                          openImageTankId === tank.id
                            ? 'bi bi-chevron-up'
                            : 'bi bi-images'
                        }
                      ></i>

                      {openImageTankId === tank.id
                        ? 'Hide Images'
                        : Object.prototype.hasOwnProperty.call(
                            tankImages,
                            tank.id
                          )
                        ? `${images.length} ${
                            images.length === 1
                              ? 'Image'
                              : 'Images'
                          }`
                        : 'Manage Images'}
                    </button>


                    <div className="tank-mobile-actions">

                      <button
                        type="button"
                        className="tank-action-edit"
                        onClick={() =>
                          handleEdit(tank)
                        }
                      >
                        <i className="bi bi-pencil"></i>
                        Edit
                      </button>


                      <button
                        type="button"
                        className="tank-action-status"
                        onClick={() =>
                          toggleActive(tank)
                        }
                      >
                        <i
                          className={
                            tank.is_active
                              ? 'bi bi-eye-slash'
                              : 'bi bi-eye'
                          }
                        ></i>

                        {tank.is_active
                          ? 'Hide'
                          : 'Show'}
                      </button>


                      <button
                        type="button"
                        className="tank-action-delete"
                        onClick={() =>
                          handleDelete(
                            tank.id
                          )
                        }
                      >
                        <i className="bi bi-trash"></i>
                        Delete
                      </button>

                    </div>

                  </div>
                )
              })}

            </div>

          </div>
        )}

      </div>


      {openImageTankId !== null &&
        filteredTanks.map((tank) => {

          if (tank.id !== openImageTankId) {
            return null
          }

          const images =
            tankImages[tank.id] || []

          const imagesLoaded =
            Object.prototype.hasOwnProperty.call(
              tankImages,
              tank.id
            )

          return (
            <div
              ref={(element) => {
                imageSectionRefs.current[
                  tank.id
                ] = element
              }}
              className="tank-image-management-card"
              key={`images-${tank.id}`}
            >

              <div className="tank-image-management-header">

                <div>
                  <span className="admin-section-label">
                    IMAGE GALLERY
                  </span>

                  <h2>
                    {tank.name}
                  </h2>

                  <p>
                    Manage the product images
                    shown to customers.
                  </p>
                </div>


                <div>

                  {imagesLoaded && (
                    <>
                      <input
                        ref={(element) => {
                          fileInputRefs.current[
                            tank.id
                          ] = element
                        }}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        hidden
                        onChange={(event) =>
                          handleImageUpload(
                            tank.id,
                            event
                          )
                        }
                      />

                      <button
                        type="button"
                        className="tank-primary-button"
                        disabled={
                          uploadingImages[tank.id]
                        }
                        onClick={() =>
                          fileInputRefs.current[
                            tank.id
                          ]?.click()
                        }
                      >
                        {uploadingImages[
                          tank.id
                        ] ? (
                          <>
                            <span className="tank-spinner"></span>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-cloud-arrow-up"></i>
                            Upload Images
                          </>
                        )}
                      </button>
                    </>
                  )}

                </div>

              </div>


              {loadingImages[tank.id] ? (
                <div className="tank-loading-state">
                  <span className="tank-spinner"></span>
                  Loading images...
                </div>
              ) : images.length === 0 ? (
                <div className="tank-image-empty">

                  <div className="tank-image-empty-icon">
                    <i className="bi bi-image"></i>
                  </div>

                  <h3>
                    No images yet
                  </h3>

                  <p>
                    Upload product images so
                    customers can see this tank.
                  </p>

                  <button
                    type="button"
                    className="tank-secondary-button"
                    onClick={() =>
                      fileInputRefs.current[
                        tank.id
                      ]?.click()
                    }
                  >
                    <i className="bi bi-plus-lg"></i>
                    Add First Image
                  </button>

                </div>
              ) : (
                <div className="tank-image-grid">

                  {images.map((image) => (

                    <div
                      className="tank-image-card"
                      key={image.id}
                    >

                      <div className="tank-image-preview">

                        <img
                          src={getImageUrl(
                            image.image_url
                          )}
                          alt={`${tank.name} product`}
                        />

                        <button
                          type="button"
                          className="tank-image-delete"
                          disabled={
                            deletingImages[
                              image.id
                            ]
                          }
                          onClick={() =>
                            handleDeleteImage(
                              tank.id,
                              image.id
                            )
                          }
                          title="Delete image"
                        >
                          {deletingImages[
                            image.id
                          ] ? (
                            <span className="tank-spinner"></span>
                          ) : (
                            <i className="bi bi-trash"></i>
                          )}
                        </button>

                      </div>

                      <div className="tank-image-card-footer">

                        <span>
                          Image #{image.id}
                        </span>

                        <span>
                          Gallery image
                        </span>

                      </div>

                    </div>

                  ))}

                </div>
              )}

            </div>
          )
        })}

    </div>
  )
}


export default TankManagementPage