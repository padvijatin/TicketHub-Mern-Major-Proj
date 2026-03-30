import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../store/auth.jsx";
import {
  createAdminEvent,
  deleteAdminEvent,
  getAdminEvents,
  updateAdminEvent,
} from "../../utils/adminApi.js";

const createSeatZone = () => ({
  sectionGroup: "",
  name: "",
  price: "",
  rows: "",
  seatsPerRow: "",
});

const initialFormState = {
  title: "",
  category: "",
  description: "",
  aboutThisEvent: "",
  language: "",
  genres: "",
  format: "",
  tags: "",
  venue: "",
  address: "",
  city: "",
  state: "",
  latitude: "",
  longitude: "",
  date: "",
  startTime: "",
  price: "",
  poster: "",
  posterFile: null,
  removePoster: false,
  status: "approved",
  isActive: true,
  seatZones: [createSeatZone()],
};

const toDateTimeLocalValue = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

const eventToFormState = (event) => ({
  title: event.title || "",
  category: event.category || "",
  description: event.description || "",
  aboutThisEvent: event.aboutThisEvent || "",
  language: (event.language || []).join(", "),
  genres: (event.genres || []).join(", "),
  format: (event.format || []).join(", "),
  tags: (event.tags || []).join(", "),
  venue: event.venue || "",
  address: event.address || "",
  city: event.city || "",
  state: event.state || "",
  latitude: event.latitude ?? "",
  longitude: event.longitude ?? "",
  date: toDateTimeLocalValue(event.date),
  startTime: event.startTime || "",
  price: event.price || "",
  poster: event.poster || "",
  posterFile: null,
  removePoster: false,
  status: event.status || "approved",
  isActive: event.isActive ?? true,
  seatZones: (event.seatZones || []).length
    ? event.seatZones.map((zone) => ({
        sectionGroup: zone.sectionGroup || "",
        name: zone.name || "",
        price: zone.price || "",
        rows: (zone.rows || []).join(", "),
        seatsPerRow: zone.seatsPerRow || "",
      }))
    : [createSeatZone()],
});

const buildPayload = (formState, role) => ({
  title: formState.title.trim(),
  category: formState.category.trim(),
  description: formState.description.trim(),
  aboutThisEvent: formState.aboutThisEvent.trim(),
  language: formState.language,
  genres: formState.genres,
  format: formState.format,
  tags: formState.tags,
  venue: formState.venue.trim(),
  address: formState.address.trim(),
  city: formState.city.trim(),
  state: formState.state.trim(),
  latitude: formState.latitude,
  longitude: formState.longitude,
  date: formState.date ? new Date(formState.date).toISOString() : "",
  startTime: formState.startTime.trim(),
  price: Number(formState.price || 0),
  poster: formState.poster.trim(),
  posterFile: formState.posterFile,
  removePoster: formState.removePoster,
  status: role === "admin" ? formState.status : undefined,
  isActive: formState.isActive,
  seatZones: formState.seatZones
    .map((zone) => ({
      sectionGroup: zone.sectionGroup.trim(),
      name: zone.name.trim(),
      price: Number(zone.price || 0),
      rows: zone.rows
        .split(",")
        .map((item) => item.trim().toUpperCase())
        .filter(Boolean),
      seatsPerRow: Number(zone.seatsPerRow || 0),
    }))
    .filter((zone) => zone.name && zone.price > 0 && zone.rows.length && zone.seatsPerRow > 0),
});

const formInputClassName = "h-[4.6rem] rounded-[1.2rem] border border-[rgba(28,28,28,0.08)] bg-white px-[1.2rem] text-[1.35rem] outline-none";
const formTextareaClassName = "rounded-[1.2rem] border border-[rgba(28,28,28,0.08)] bg-white px-[1.2rem] py-[1rem] text-[1.35rem] outline-none";

const EventManagement = ({ role }) => {
  const queryClient = useQueryClient();
  const { authorizationToken } = useAuth();
  const [formState, setFormState] = useState(initialFormState);
  const [editingEventId, setEditingEventId] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { data: events = [], isLoading, isError } = useQuery({
    queryKey: ["admin-events", authorizationToken, role],
    queryFn: () => getAdminEvents(authorizationToken),
    enabled: Boolean(authorizationToken),
  });

  const posterPreview = useMemo(() => {
    if (formState.posterFile instanceof File) {
      return URL.createObjectURL(formState.posterFile);
    }

    return formState.removePoster ? "" : formState.poster;
  }, [formState.poster, formState.posterFile, formState.removePoster]);

  useEffect(() => () => {
    if (posterPreview && posterPreview.startsWith("blob:")) {
      URL.revokeObjectURL(posterPreview);
    }
  }, [posterPreview]);

  const resetForm = () => {
    setFormState(initialFormState);
    setEditingEventId("");
    setIsFormOpen(false);
  };

  const invalidateManagementQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-events"] });
    queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
  };

  const createMutation = useMutation({
    mutationFn: (payload) => createAdminEvent({ authorizationToken, payload }),
    onSuccess: () => {
      toast.success(role === "admin" ? "Event created successfully" : "Event submitted successfully");
      invalidateManagementQueries();
      resetForm();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Unable to create event right now");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ eventId, payload }) => updateAdminEvent({ authorizationToken, eventId, payload }),
    onSuccess: () => {
      toast.success("Event updated successfully");
      invalidateManagementQueries();
      resetForm();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Unable to update event right now");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (eventId) => deleteAdminEvent({ authorizationToken, eventId }),
    onSuccess: () => {
      toast.success("Event archived successfully");
      invalidateManagementQueries();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Unable to archive event right now");
    },
  });

  const sortedEvents = useMemo(
    () => [...events].sort((left, right) => new Date(right.date || 0).getTime() - new Date(left.date || 0).getTime()),
    [events]
  );

  const handleEdit = (event) => {
    setEditingEventId(event.id);
    setFormState(eventToFormState(event));
    setIsFormOpen(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = buildPayload(formState, role);

    if (editingEventId) {
      updateMutation.mutate({ eventId: editingEventId, payload });
      return;
    }

    createMutation.mutate(payload);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const heading = role === "admin" ? "Event Management" : "My Events";
  const subheading = role === "admin"
    ? "Create, edit, review, and archive live event listings with full collection fields."
    : "Create and manage your event submissions with posters, seat layouts, and location details.";

  return (
    <div className="space-y-[2rem]">
      <div>
        <h1 className="text-[2.6rem] font-extrabold text-[var(--color-text-primary)]">{heading}</h1>
        <p className="mt-[0.5rem] text-[1.35rem] text-[var(--color-text-secondary)]">{subheading}</p>
      </div>

      <div className="rounded-[1.8rem] border border-[rgba(28,28,28,0.08)] bg-white p-[2rem] shadow-[0_16px_36px_rgba(28,28,28,0.06)]">
        <div className="mb-[1.6rem] flex items-center justify-between gap-[1rem]">
          <h2 className="text-[1.7rem] font-bold text-[var(--color-text-primary)]">
            {role === "admin" ? "All Events" : "Organizer Events"}
          </h2>
          <button
            type="button"
            onClick={() => {
              if (isFormOpen && !editingEventId) {
                resetForm();
                return;
              }

              setEditingEventId("");
              setFormState(initialFormState);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center gap-[0.6rem] rounded-[1.2rem] bg-[var(--color-primary)] px-[1.4rem] py-[0.85rem] text-[1.25rem] font-semibold text-white"
          >
            {isFormOpen && !editingEventId ? <X className="h-[1.6rem] w-[1.6rem]" /> : <Plus className="h-[1.6rem] w-[1.6rem]" />}
            {isFormOpen && !editingEventId ? "Close" : role === "admin" ? "Add Event" : "Create Event"}
          </button>
        </div>

        {isFormOpen ? (
          <form onSubmit={handleSubmit} className="mb-[2rem] space-y-[1.6rem] rounded-[1.6rem] bg-[rgba(28,28,28,0.02)] p-[1.6rem]">
            <div className="grid gap-[1.2rem] md:grid-cols-2 xl:grid-cols-3">
              {[
                ["title", "Title"],
                ["category", "Category"],
                ["venue", "Venue"],
                ["address", "Address"],
                ["city", "City"],
                ["state", "State"],
                ["latitude", "Latitude", "number"],
                ["longitude", "Longitude", "number"],
                ["date", "Date & Time", "datetime-local"],
                ["startTime", "Start Time"],
                ["price", "Starting Price", "number"],
                ["language", "Languages (comma separated)"],
                ["genres", "Genres (comma separated)"],
                ["format", "Formats (comma separated)"],
                ["tags", "Tags (comma separated)"],
              ].map(([field, label, type]) => (
                <label key={field} className="grid gap-[0.5rem] text-[1.25rem] font-semibold text-[var(--color-text-primary)]">
                  {label}
                  <input
                    type={type || "text"}
                    value={formState[field]}
                    onChange={(eventObject) => setFormState((current) => ({ ...current, [field]: eventObject.target.value }))}
                    className={formInputClassName}
                  />
                </label>
              ))}

              {role === "admin" ? (
                <label className="grid gap-[0.5rem] text-[1.25rem] font-semibold text-[var(--color-text-primary)]">
                  Status
                  <select
                    value={formState.status}
                    onChange={(eventObject) => setFormState((current) => ({ ...current, status: eventObject.target.value }))}
                    className={formInputClassName}
                  >
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </label>
              ) : (
                <div className="grid gap-[0.5rem] text-[1.25rem] font-semibold text-[var(--color-text-primary)]">
                  Submission Status
                  <div className="flex h-[4.6rem] items-center rounded-[1.2rem] border border-[rgba(28,28,28,0.08)] bg-white px-[1.2rem] text-[1.3rem] text-[var(--color-text-secondary)]">
                    Organizer submissions are saved as pending until reviewed by admin.
                  </div>
                </div>
              )}

              <label className="grid gap-[0.65rem] text-[1.25rem] font-semibold text-[var(--color-text-primary)]">
                Active Listing
                <select
                  value={formState.isActive ? "true" : "false"}
                  onChange={(eventObject) => setFormState((current) => ({ ...current, isActive: eventObject.target.value === "true" }))}
                  className={formInputClassName}
                >
                  <option value="true">Active</option>
                  <option value="false">Archived</option>
                </select>
              </label>
            </div>

            <div className="grid gap-[1.2rem] lg:grid-cols-[minmax(0,1.2fr)_28rem]">
              <div className="grid gap-[1.2rem]">
                <label className="grid gap-[0.5rem] text-[1.25rem] font-semibold text-[var(--color-text-primary)]">
                  Description
                  <textarea
                    rows="4"
                    value={formState.description}
                    onChange={(eventObject) => setFormState((current) => ({ ...current, description: eventObject.target.value }))}
                    className={formTextareaClassName}
                  />
                </label>
                <label className="grid gap-[0.5rem] text-[1.25rem] font-semibold text-[var(--color-text-primary)]">
                  About This Event
                  <textarea
                    rows="6"
                    value={formState.aboutThisEvent}
                    onChange={(eventObject) => setFormState((current) => ({ ...current, aboutThisEvent: eventObject.target.value }))}
                    className={formTextareaClassName}
                  />
                </label>
              </div>

              <div className="rounded-[1.4rem] border border-[rgba(28,28,28,0.08)] bg-white p-[1.2rem]">
                <div className="flex items-center gap-[0.7rem] text-[1.3rem] font-bold text-[var(--color-text-primary)]">
                  <ImagePlus className="h-[1.7rem] w-[1.7rem] text-[var(--color-primary)]" />
                  Poster Upload
                </div>
                <label className="mt-[1rem] grid gap-[0.5rem] text-[1.15rem] font-semibold text-[var(--color-text-primary)]">
                  Poster URL
                  <input
                    type="text"
                    value={formState.poster}
                    onChange={(eventObject) => setFormState((current) => ({ ...current, poster: eventObject.target.value, removePoster: false }))}
                    className={formInputClassName}
                  />
                </label>
                <label className="mt-[1rem] flex h-[4.6rem] cursor-pointer items-center justify-center gap-[0.6rem] rounded-[1.2rem] border border-dashed border-[rgba(28,28,28,0.18)] bg-[rgba(28,28,28,0.02)] text-[1.2rem] font-semibold text-[var(--color-text-primary)]">
                  <Upload className="h-[1.6rem] w-[1.6rem]" />
                  Upload poster image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(eventObject) => {
                      const nextFile = eventObject.target.files?.[0] || null;
                      setFormState((current) => ({ ...current, posterFile: nextFile, removePoster: false }));
                    }}
                  />
                </label>
                <label className="mt-[1rem] flex items-center gap-[0.7rem] text-[1.15rem] text-[var(--color-text-secondary)]">
                  <input
                    type="checkbox"
                    checked={formState.removePoster}
                    onChange={(eventObject) => setFormState((current) => ({ ...current, removePoster: eventObject.target.checked, posterFile: eventObject.target.checked ? null : current.posterFile }))}
                  />
                  Remove current poster
                </label>
                <div className="mt-[1rem] overflow-hidden rounded-[1.2rem] border border-[rgba(28,28,28,0.08)] bg-[rgba(28,28,28,0.02)]">
                  {posterPreview ? (
                    <img src={posterPreview} alt="Poster preview" className="h-[20rem] w-full object-cover" />
                  ) : (
                    <div className="grid h-[20rem] place-items-center text-[1.2rem] text-[var(--color-text-secondary)]">No poster selected</div>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-[rgba(28,28,28,0.08)] bg-white p-[1.2rem]">
              <div className="mb-[1rem] flex items-center justify-between gap-[1rem]">
                <div>
                  <h3 className="text-[1.5rem] font-bold text-[var(--color-text-primary)]">Seat Zones</h3>
                  <p className="mt-[0.35rem] text-[1.15rem] text-[var(--color-text-secondary)]">
                    Add each section with price, rows, and seats per row. Total seats are calculated automatically.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormState((current) => ({ ...current, seatZones: [...current.seatZones, createSeatZone()] }))}
                  className="inline-flex items-center gap-[0.5rem] rounded-[1rem] border border-[rgba(28,28,28,0.08)] px-[1rem] py-[0.7rem] text-[1.15rem] font-semibold text-[var(--color-text-primary)]"
                >
                  <Plus className="h-[1.4rem] w-[1.4rem]" /> Add zone
                </button>
              </div>

              <div className="space-y-[1rem]">
                {formState.seatZones.map((zone, zoneIndex) => (
                  <div key={`${zoneIndex}-${zone.name}`} className="grid gap-[1rem] rounded-[1.2rem] border border-[rgba(28,28,28,0.08)] p-[1rem] md:grid-cols-2 xl:grid-cols-5">
                    {[
                      ["sectionGroup", "Group"],
                      ["name", "Zone Name"],
                      ["price", "Zone Price", "number"],
                      ["rows", "Rows (comma separated)"],
                      ["seatsPerRow", "Seats / Row", "number"],
                    ].map(([field, label, type]) => (
                      <label key={field} className="grid gap-[0.4rem] text-[1.15rem] font-semibold text-[var(--color-text-primary)]">
                        {label}
                        <input
                          type={type || "text"}
                          value={zone[field]}
                          onChange={(eventObject) =>
                            setFormState((current) => ({
                              ...current,
                              seatZones: current.seatZones.map((item, index) =>
                                index === zoneIndex ? { ...item, [field]: eventObject.target.value } : item
                              ),
                            }))
                          }
                          className={formInputClassName}
                        />
                      </label>
                    ))}
                    <div className="flex items-end justify-end md:col-span-2 xl:col-span-5">
                      <button
                        type="button"
                        onClick={() =>
                          setFormState((current) => ({
                            ...current,
                            seatZones: current.seatZones.length === 1 ? [createSeatZone()] : current.seatZones.filter((_, index) => index !== zoneIndex),
                          }))
                        }
                        className="inline-flex items-center gap-[0.45rem] rounded-[1rem] border border-[rgba(239,68,68,0.16)] px-[1rem] py-[0.7rem] text-[1.15rem] font-semibold text-[var(--color-error)]"
                      >
                        <Trash2 className="h-[1.4rem] w-[1.4rem]" /> Remove zone
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-[1rem]">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-[1.2rem] bg-[var(--color-primary)] px-[1.6rem] py-[1rem] text-[1.3rem] font-semibold text-white disabled:opacity-60"
              >
                {isSubmitting ? "Saving..." : editingEventId ? "Update Event" : role === "admin" ? "Create Event" : "Submit Event"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-[1.2rem] border border-[rgba(28,28,28,0.08)] bg-white px-[1.6rem] py-[1rem] text-[1.3rem] font-semibold text-[var(--color-text-primary)]"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[110rem] text-left">
            <thead>
              <tr className="border-b border-[rgba(28,28,28,0.08)] text-[1.2rem] uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">
                <th className="py-[1rem] font-semibold">Event</th>
                <th className="py-[1rem] font-semibold">Category</th>
                <th className="py-[1rem] font-semibold">City</th>
                <th className="py-[1rem] font-semibold">Date</th>
                <th className="py-[1rem] font-semibold">Status</th>
                <th className="py-[1rem] font-semibold">Seats</th>
                <th className="py-[1rem] font-semibold">Price</th>
                {role === "admin" ? <th className="py-[1rem] font-semibold">Organizer</th> : null}
                <th className="py-[1rem] font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={role === "admin" ? "9" : "8"} className="py-[2rem] text-center text-[1.4rem] text-[var(--color-text-secondary)]">Loading events...</td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={role === "admin" ? "9" : "8"} className="py-[2rem] text-center text-[1.4rem] text-[var(--color-text-secondary)]">Unable to load events right now.</td>
                </tr>
              ) : sortedEvents.length ? (
                sortedEvents.map((event) => (
                  <tr key={event.id} className="border-b border-[rgba(28,28,28,0.06)] last:border-0">
                    <td className="py-[1.3rem] text-[1.35rem] font-semibold text-[var(--color-text-primary)]">{event.title}</td>
                    <td className="py-[1.3rem] text-[1.35rem] text-[var(--color-text-primary)]">{event.category}</td>
                    <td className="py-[1.3rem] text-[1.35rem] text-[var(--color-text-primary)]">{event.city}</td>
                    <td className="py-[1.3rem] text-[1.35rem] text-[var(--color-text-primary)]">{event.date ? new Date(event.date).toLocaleString("en-IN") : "-"}</td>
                    <td className="py-[1.3rem]">
                      <span className="inline-flex rounded-full bg-[rgba(248,68,100,0.1)] px-[1rem] py-[0.45rem] text-[1.15rem] font-semibold capitalize text-[var(--color-primary)]">
                        {event.status}
                      </span>
                      {!event.isActive ? (
                        <span className="ml-[0.6rem] inline-flex rounded-full bg-[rgba(28,28,28,0.08)] px-[1rem] py-[0.45rem] text-[1.15rem] font-semibold text-[var(--color-text-secondary)]">
                          archived
                        </span>
                      ) : null}
                    </td>
                    <td className="py-[1.3rem] text-[1.35rem] text-[var(--color-text-primary)]">{event.totalSeats || 0}</td>
                    <td className="py-[1.3rem] text-[1.35rem] font-semibold text-[var(--color-text-primary)]">Rs {Number(event.price || 0).toLocaleString("en-IN")}</td>
                    {role === "admin" ? (
                      <td className="py-[1.3rem] text-[1.25rem] text-[var(--color-text-primary)]">{event.organizer?.username || event.organizer?.email || "-"}</td>
                    ) : null}
                    <td className="py-[1.3rem]">
                      <div className="flex flex-wrap gap-[0.8rem]">
                        <button
                          type="button"
                          onClick={() => handleEdit(event)}
                          className="inline-flex items-center gap-[0.45rem] rounded-[1rem] border border-[rgba(28,28,28,0.08)] px-[1rem] py-[0.7rem] text-[1.2rem] font-semibold text-[var(--color-text-primary)]"
                        >
                          <Pencil className="h-[1.4rem] w-[1.4rem]" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteMutation.mutate(event.id)}
                          disabled={deleteMutation.isPending}
                          className="inline-flex items-center gap-[0.45rem] rounded-[1rem] border border-[rgba(239,68,68,0.16)] px-[1rem] py-[0.7rem] text-[1.2rem] font-semibold text-[var(--color-error)] disabled:opacity-60"
                        >
                          <Trash2 className="h-[1.4rem] w-[1.4rem]" /> Archive
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={role === "admin" ? "9" : "8"} className="py-[2rem] text-center text-[1.4rem] text-[var(--color-text-secondary)]">No events found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EventManagement;
