import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../utils/api";
import {
  PageHeader,
  Btn,
  Icon,
  Modal,
  Input,
  Select,
  Spinner,
  Table,
  TR,
  TD,
  Card,
  Badge,
} from "../../components/UI";

// ─── ACTION BUTTONS ──────────────────────────────────────────────────────────
function ActionButtons({ onEdit, onDelete }) {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      <button
        onClick={onEdit}
        title="Edit"
        style={{
          border: "none",
          background: "none",
          cursor: "pointer",
          padding: 6,
          borderRadius: 6,
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,210,190,0.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
      >
        <Icon name="edit" size={14} />
      </button>
      <button
        onClick={onDelete}
        title="Delete"
        style={{
          border: "none",
          background: "none",
          cursor: "pointer",
          padding: 6,
          borderRadius: 6,
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(248,113,113,0.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
      >
        <Icon name="trash" size={14} color="var(--danger)" />
      </button>
    </div>
  );
}

// ─── DEPARTMENTS ─────────────────────────────────────────────────────────────
export function Departments() {
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", shortName: "" });

  const load = () => {
    setLoading(true);
    api
      .get("/departments")
      .then((r) => {
        setData(r.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const open = (item = null) => {
    setEdit(item);
    setForm(item ? { name: item.name, shortName: item.shortName } : { name: "", shortName: "" });
    setModal(true);
  };

  const save = async () => {
    if (!form.name.trim() || !form.shortName.trim()) {
      return toast.error("Please fill in all required fields");
    }
    try {
      if (editing) {
        await api.put(`/departments/${editing._id}`, form);
        toast.success("Department updated successfully");
      } else {
        await api.post("/departments", form);
        toast.success("Department added successfully");
      }
      setModal(false);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to save department");
    }
  };

  const del = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;
    try {
      await api.delete(`/departments/${id}`);
      toast.success("Department deleted successfully");
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to delete department");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader
        title="Departments"
        subtitle="Manage academic and administrative departments"
        icon="dept"
        action={
          <Btn onClick={() => open()}>
            <Icon name="raise" size={14} color="#071210" />
            Add Department
          </Btn>
        }
      />
      <Card>
        {data.length === 0 ? (
          <p style={{ color: "var(--text3)", textAlign: "center", padding: 40 }}>
            No departments found. Click "Add Department" to create one.
          </p>
        ) : (
          <Table cols={["Code", "Department Name", "Actions"]}>
            {data.map((d) => (
              <TR key={d._id}>
                <TD style={{ fontWeight: 700, color: "var(--accent)" }}>{d.shortName}</TD>
                <TD style={{ fontWeight: 600, color: "var(--text)" }}>{d.name}</TD>
                <TD>
                  <ActionButtons onEdit={() => open(d)} onDelete={() => del(d._id)} />
                </TD>
              </TR>
            ))}
          </Table>
        )}
      </Card>

      {modal && (
        <Modal title={editing ? "Edit Department" : "Add Department"} onClose={() => setModal(false)}>
          <Input
            label="Department Name *"
            placeholder="e.g. Computer Science & Engineering"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Short Code *"
            placeholder="e.g. CSE"
            value={form.shortName}
            onChange={(e) => setForm({ ...form, shortName: e.target.value.toUpperCase() })}
          />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 24 }}>
            <Btn variant="ghost" onClick={() => setModal(false)}>
              Cancel
            </Btn>
            <Btn onClick={save}>Save</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── PROGRAMMES ──────────────────────────────────────────────────────────────
export function Programmes() {
  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", shortName: "", department: "" });

  const load = () => {
    setLoading(true);
    Promise.all([api.get("/programmes"), api.get("/departments")])
      .then(([progRes, deptRes]) => {
        setData(progRes.data.data);
        setDepartments(deptRes.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const open = (item = null) => {
    setEdit(item);
    setForm(
      item
        ? {
            name: item.name,
            shortName: item.shortName,
            department: item.department?._id || item.department || "",
          }
        : { name: "", shortName: "", department: departments[0]?._id || "" }
    );
    setModal(true);
  };

  const save = async () => {
    if (!form.name.trim() || !form.shortName.trim() || !form.department) {
      return toast.error("Please fill in all required fields");
    }
    try {
      if (editing) {
        await api.put(`/programmes/${editing._id}`, form);
        toast.success("Programme updated successfully");
      } else {
        await api.post("/programmes", form);
        toast.success("Programme added successfully");
      }
      setModal(false);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to save programme");
    }
  };

  const del = async (id) => {
    if (!window.confirm("Are you sure you want to delete this programme?")) return;
    try {
      await api.delete(`/programmes/${id}`);
      toast.success("Programme deleted successfully");
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to delete programme");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader
        title="Programmes"
        subtitle="Manage academic programmes and degrees"
        icon="programme"
        action={
          <Btn onClick={() => open()}>
            <Icon name="raise" size={14} color="#071210" />
            Add Programme
          </Btn>
        }
      />
      <Card>
        {data.length === 0 ? (
          <p style={{ color: "var(--text3)", textAlign: "center", padding: 40 }}>
            No programmes found. Click "Add Programme" to create one.
          </p>
        ) : (
          <Table cols={["Degree / Code", "Programme Name", "Department", "Actions"]}>
            {data.map((p) => (
              <TR key={p._id}>
                <TD style={{ fontWeight: 700, color: "var(--accent)" }}>{p.shortName}</TD>
                <TD style={{ fontWeight: 600, color: "var(--text)" }}>{p.name}</TD>
                <TD>{p.department?.name ? `${p.department.name} (${p.department.shortName})` : "—"}</TD>
                <TD>
                  <ActionButtons onEdit={() => open(p)} onDelete={() => del(p._id)} />
                </TD>
              </TR>
            ))}
          </Table>
        )}
      </Card>

      {modal && (
        <Modal title={editing ? "Edit Programme" : "Add Programme"} onClose={() => setModal(false)}>
          <Select
            label="Department *"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name} ({d.shortName})
              </option>
            ))}
          </Select>
          <Input
            label="Programme Name *"
            placeholder="e.g. Bachelor of Technology"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Short Name / Code *"
            placeholder="e.g. B.Tech"
            value={form.shortName}
            onChange={(e) => setForm({ ...form, shortName: e.target.value })}
          />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 24 }}>
            <Btn variant="ghost" onClick={() => setModal(false)}>
              Cancel
            </Btn>
            <Btn onClick={save}>Save</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── BLOCKS ──────────────────────────────────────────────────────────────────
export function Blocks() {
  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", department: "", programme: "" });

  const load = () => {
    setLoading(true);
    Promise.all([api.get("/blocks"), api.get("/departments"), api.get("/programmes")])
      .then(([blockRes, deptRes, progRes]) => {
        setData(blockRes.data.data);
        setDepartments(deptRes.data.data);
        setProgrammes(progRes.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const open = (item = null) => {
    setEdit(item);
    setForm(
      item
        ? {
            name: item.name,
            department: item.department?._id || item.department || "",
            programme: item.programme?._id || item.programme || "",
          }
        : {
            name: "",
            department: departments[0]?._id || "",
            programme: programmes[0]?._id || "",
          }
    );
    setModal(true);
  };

  const filteredProgrammes = form.department
    ? programmes.filter((p) => (p.department?._id || p.department) === form.department)
    : programmes;

  const save = async () => {
    if (!form.name.trim() || !form.department || !form.programme) {
      return toast.error("Please fill in all required fields");
    }
    try {
      if (editing) {
        await api.put(`/blocks/${editing._id}`, form);
        toast.success("Block updated successfully");
      } else {
        await api.post("/blocks", form);
        toast.success("Block added successfully");
      }
      setModal(false);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to save block");
    }
  };

  const del = async (id) => {
    if (!window.confirm("Are you sure you want to delete this block?")) return;
    try {
      await api.delete(`/blocks/${id}`);
      toast.success("Block deleted successfully");
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to delete block");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader
        title="Blocks"
        subtitle="Manage campus buildings and blocks"
        icon="block"
        action={
          <Btn onClick={() => open()}>
            <Icon name="raise" size={14} color="#071210" />
            Add Block
          </Btn>
        }
      />
      <Card>
        {data.length === 0 ? (
          <p style={{ color: "var(--text3)", textAlign: "center", padding: 40 }}>
            No blocks found. Click "Add Block" to create one.
          </p>
        ) : (
          <Table cols={["Block Name", "Department", "Programme", "Actions"]}>
            {data.map((b) => (
              <TR key={b._id}>
                <TD style={{ fontWeight: 600, color: "var(--text)" }}>{b.name}</TD>
                <TD>{b.department?.name ? `${b.department.name} (${b.department.shortName})` : "—"}</TD>
                <TD>{b.programme?.name ? `${b.programme.name} (${b.programme.shortName})` : "—"}</TD>
                <TD>
                  <ActionButtons onEdit={() => open(b)} onDelete={() => del(b._id)} />
                </TD>
              </TR>
            ))}
          </Table>
        )}
      </Card>

      {modal && (
        <Modal title={editing ? "Edit Block" : "Add Block"} onClose={() => setModal(false)}>
          <Select
            label="Department *"
            value={form.department}
            onChange={(e) =>
              setForm({
                ...form,
                department: e.target.value,
                programme: "",
              })
            }
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name} ({d.shortName})
              </option>
            ))}
          </Select>
          <Select
            label="Programme *"
            value={form.programme}
            onChange={(e) => setForm({ ...form, programme: e.target.value })}
          >
            <option value="">Select Programme</option>
            {filteredProgrammes.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.shortName})
              </option>
            ))}
          </Select>
          <Input
            label="Block Name *"
            placeholder="e.g. Block A / Science Block"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 24 }}>
            <Btn variant="ghost" onClick={() => setModal(false)}>
              Cancel
            </Btn>
            <Btn onClick={save}>Save</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── ROOMS ───────────────────────────────────────────────────────────────────
export function Rooms() {
  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ number: "", department: "", programme: "", block: "" });

  const load = () => {
    setLoading(true);
    Promise.all([
      api.get("/rooms"),
      api.get("/departments"),
      api.get("/programmes"),
      api.get("/blocks"),
    ])
      .then(([roomRes, deptRes, progRes, blockRes]) => {
        setData(roomRes.data.data);
        setDepartments(deptRes.data.data);
        setProgrammes(progRes.data.data);
        setBlocks(blockRes.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const open = (item = null) => {
    setEdit(item);
    setForm(
      item
        ? {
            number: item.number,
            department: item.department?._id || item.department || "",
            programme: item.programme?._id || item.programme || "",
            block: item.block?._id || item.block || "",
          }
        : {
            number: "",
            department: departments[0]?._id || "",
            programme: programmes[0]?._id || "",
            block: blocks[0]?._id || "",
          }
    );
    setModal(true);
  };

  const filteredBlocks = form.department
    ? blocks.filter((b) => (b.department?._id || b.department) === form.department)
    : blocks;

  const save = async () => {
    if (!form.number.trim() || !form.department || !form.programme || !form.block) {
      return toast.error("Please fill in all required fields");
    }
    try {
      if (editing) {
        await api.put(`/rooms/${editing._id}`, form);
        toast.success("Room updated successfully");
      } else {
        await api.post("/rooms", form);
        toast.success("Room added successfully");
      }
      setModal(false);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to save room");
    }
  };

  const del = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      await api.delete(`/rooms/${id}`);
      toast.success("Room deleted successfully");
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to delete room");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader
        title="Rooms"
        subtitle="Manage room numbers across blocks and departments"
        icon="room"
        action={
          <Btn onClick={() => open()}>
            <Icon name="raise" size={14} color="#071210" />
            Add Room
          </Btn>
        }
      />
      <Card>
        {data.length === 0 ? (
          <p style={{ color: "var(--text3)", textAlign: "center", padding: 40 }}>
            No rooms found. Click "Add Room" to create one.
          </p>
        ) : (
          <Table cols={["Room Number", "Block", "Department", "Programme", "Actions"]}>
            {data.map((r) => (
              <TR key={r._id}>
                <TD style={{ fontWeight: 700, color: "var(--accent)" }}>{r.number}</TD>
                <TD style={{ fontWeight: 600, color: "var(--text)" }}>{r.block?.name || "—"}</TD>
                <TD>{r.department?.name ? `${r.department.name} (${r.department.shortName})` : "—"}</TD>
                <TD>{r.programme?.name ? `${r.programme.name} (${r.programme.shortName})` : "—"}</TD>
                <TD>
                  <ActionButtons onEdit={() => open(r)} onDelete={() => del(r._id)} />
                </TD>
              </TR>
            ))}
          </Table>
        )}
      </Card>

      {modal && (
        <Modal title={editing ? "Edit Room" : "Add Room"} onClose={() => setModal(false)}>
          <Select
            label="Department *"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name} ({d.shortName})
              </option>
            ))}
          </Select>
          <Select
            label="Programme *"
            value={form.programme}
            onChange={(e) => setForm({ ...form, programme: e.target.value })}
          >
            <option value="">Select Programme</option>
            {programmes.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.shortName})
              </option>
            ))}
          </Select>
          <Select
            label="Block *"
            value={form.block}
            onChange={(e) => setForm({ ...form, block: e.target.value })}
          >
            <option value="">Select Block</option>
            {filteredBlocks.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </Select>
          <Input
            label="Room Number *"
            placeholder="e.g. 101, Lab 3, Hall A"
            value={form.number}
            onChange={(e) => setForm({ ...form, number: e.target.value })}
          />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 24 }}>
            <Btn variant="ghost" onClick={() => setModal(false)}>
              Cancel
            </Btn>
            <Btn onClick={save}>Save</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── ROLE CARD ───────────────────────────────────────────────────────────────
function RoleCard({ r, onEdit, onDelete }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "var(--surface)",
        borderRadius: 12,
        padding: "16px 18px",
        border: `1px solid ${hov ? "rgba(99,210,190,0.25)" : "var(--border)"}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        transition: "all 0.2s",
        transform: hov ? "translateY(-2px)" : "none",
        boxShadow: hov ? "0 8px 24px rgba(0,0,0,0.2)" : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 9,
            background: "rgba(99,210,190,0.08)",
            border: "1px solid rgba(99,210,190,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="role" size={16} />
        </div>
        <span style={{ fontWeight: 600, color: "var(--text)", fontSize: 13 }}>{r.name}</span>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <button
          onClick={() => onEdit(r)}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            padding: 6,
            borderRadius: 6,
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,210,190,0.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        >
          <Icon name="edit" size={14} />
        </button>
        <button
          onClick={() => onDelete(r._id)}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            padding: 6,
            borderRadius: 6,
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(248,113,113,0.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        >
          <Icon name="trash" size={14} color="var(--danger)" />
        </button>
      </div>
    </div>
  );
}

// ─── ROLES ───────────────────────────────────────────────────────────────────
export function Roles() {
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "" });

  const load = () => {
    setLoading(true);
    api
      .get("/roles")
      .then((r) => {
        setData(r.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const open = (item = null) => {
    setEdit(item);
    setForm(item ? { name: item.name } : { name: "" });
    setModal(true);
  };

  const save = async () => {
    if (!form.name.trim()) return toast.error("Role name required");
    try {
      if (editing) {
        await api.put(`/roles/${editing._id}`, form);
        toast.success("Role updated successfully");
      } else {
        await api.post("/roles", form);
        toast.success("Role added successfully");
      }
      setModal(false);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to save role");
    }
  };

  const del = async (id) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;
    try {
      await api.delete(`/roles/${id}`);
      toast.success("Role deleted successfully");
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to delete role");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader
        title="Roles"
        subtitle="Manage system roles and permissions"
        icon="role"
        action={
          <Btn onClick={() => open()}>
            <Icon name="raise" size={14} color="#071210" />
            Add Role
          </Btn>
        }
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
          gap: 14,
        }}
      >
        {data.length === 0 && (
          <p style={{ color: "var(--text3)", gridColumn: "1/-1", textAlign: "center", padding: 40 }}>
            No roles yet
          </p>
        )}
        {data.map((r, i) => (
          <div key={r._id} style={{ animation: `fadeUp 0.3s ease ${i * 0.05}s both` }}>
            <RoleCard r={r} onEdit={open} onDelete={del} />
          </div>
        ))}
      </div>
      {modal && (
        <Modal title={editing ? "Edit Role" : "Add Role"} onClose={() => setModal(false)}>
          <Input
            label="Role Name *"
            value={form.name}
            onChange={(e) => setForm({ name: e.target.value })}
            placeholder="e.g. Networking Staff"
          />
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 24 }}>
            <Btn variant="ghost" onClick={() => setModal(false)}>
              Cancel
            </Btn>
            <Btn onClick={save}>Save</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── USERS ───────────────────────────────────────────────────────────────────
export function Users() {
  const [data, setData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    department: "",
    programme: "",
    isActive: true,
  });

  const load = () => {
    setLoading(true);
    Promise.all([
      api.get("/users"),
      api.get("/roles"),
      api.get("/departments"),
      api.get("/programmes"),
    ])
      .then(([userRes, roleRes, deptRes, progRes]) => {
        setData(userRes.data.data);
        setRoles(roleRes.data.data);
        setDepartments(deptRes.data.data);
        setProgrammes(progRes.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const open = (item = null) => {
    setEdit(item);
    setForm(
      item
        ? {
            name: item.name,
            username: item.username,
            email: item.email,
            phone: item.phone,
            password: "",
            role: item.role?._id || item.role || "",
            department: item.department?._id || item.department || "",
            programme: item.programme?._id || item.programme || "",
            isActive: item.isActive !== false,
          }
        : {
            name: "",
            username: "",
            email: "",
            phone: "",
            password: "",
            role: roles[0]?._id || "",
            department: "",
            programme: "",
            isActive: true,
          }
    );
    setModal(true);
  };

  const save = async () => {
    if (!form.name.trim() || !form.username.trim() || !form.email.trim() || !form.phone.trim() || !form.role) {
      return toast.error("Please fill in all required fields");
    }
    if (!editing && !form.password) {
      return toast.error("Password is required for new users");
    }

    const payload = { ...form };
    if (!payload.department) delete payload.department;
    if (!payload.programme) delete payload.programme;
    if (editing && !payload.password) delete payload.password;

    try {
      if (editing) {
        await api.put(`/users/${editing._id}`, payload);
        toast.success("User updated successfully");
      } else {
        await api.post("/users", payload);
        toast.success("User added successfully");
      }
      setModal(false);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to save user");
    }
  };

  const del = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success("User deleted successfully");
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to delete user");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle="Manage accounts, staff, and access roles"
        icon="users"
        action={
          <Btn onClick={() => open()}>
            <Icon name="raise" size={14} color="#071210" />
            Add User
          </Btn>
        }
      />
      <Card>
        {data.length === 0 ? (
          <p style={{ color: "var(--text3)", textAlign: "center", padding: 40 }}>
            No users found. Click "Add User" to create one.
          </p>
        ) : (
          <Table cols={["User", "Contact", "Role", "Department", "Status", "Actions"]}>
            {data.map((u) => (
              <TR key={u._id}>
                <TD>
                  <div style={{ fontWeight: 600, color: "var(--text)" }}>{u.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>@{u.username}</div>
                </TD>
                <TD>
                  <div style={{ color: "var(--text)" }}>{u.email}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>{u.phone}</div>
                </TD>
                <TD>
                  <Badge
                    status={
                      u.role?.name === "SuperAdmin"
                        ? "Assigned"
                        : u.role?.name === "User"
                        ? "Completed"
                        : "In-Progress"
                    }
                  >
                    {u.role?.name || "—"}
                  </Badge>
                </TD>
                <TD>{u.department?.shortName || u.department?.name || "—"}</TD>
                <TD>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "3px 8px",
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 600,
                      background: u.isActive !== false ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)",
                      color: u.isActive !== false ? "#34d399" : "#f87171",
                    }}
                  >
                    {u.isActive !== false ? "Active" : "Inactive"}
                  </span>
                </TD>
                <TD>
                  <ActionButtons onEdit={() => open(u)} onDelete={() => del(u._id)} />
                </TD>
              </TR>
            ))}
          </Table>
        )}
      </Card>

      {modal && (
        <Modal title={editing ? "Edit User" : "Add User"} onClose={() => setModal(false)} width={620}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
            <Input
              label="Full Name *"
              placeholder="e.g. John Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              label="Username *"
              placeholder="e.g. jdoe"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <Input
              label="Email *"
              type="email"
              placeholder="e.g. jdoe@university.edu"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              label="Phone *"
              placeholder="e.g. 9876543210"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <div style={{ gridColumn: "1/-1" }}>
              <Input
                label={editing ? "Password (leave blank to keep current)" : "Password *"}
                type="password"
                placeholder={editing ? "••••••••" : "Enter password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <Select
              label="Role *"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.name}
                </option>
              ))}
            </Select>
            <Select
              label="Department (Optional)"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            >
              <option value="">None / General</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name} ({d.shortName})
                </option>
              ))}
            </Select>
            <Select
              label="Programme (Optional)"
              value={form.programme}
              onChange={(e) => setForm({ ...form, programme: e.target.value })}
            >
              <option value="">None</option>
              {programmes.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.shortName})
                </option>
              ))}
            </Select>
            <Select
              label="Status"
              value={form.isActive ? "true" : "false"}
              onChange={(e) => setForm({ ...form, isActive: e.target.value === "true" })}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </Select>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 24 }}>
            <Btn variant="ghost" onClick={() => setModal(false)}>
              Cancel
            </Btn>
            <Btn onClick={save}>Save</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}