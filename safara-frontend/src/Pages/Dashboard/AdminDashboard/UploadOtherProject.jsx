import { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../../../firebase/firebase";
import { FaEdit, FaTrash } from "react-icons/fa";

const UploadOtherProject = () => {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [editId, setEditId] = useState(null);
  const [editImg, setEditImg] = useState(null);

  const navigate = useNavigate();

  // 🔹 Fetch all projects from Firestore
  const fetchProjects = async () => {
    try {
      const snapshot = await getDocs(collection(db, "otherProjects"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      Swal.fire("Error", "Failed to load projects!", "error");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // 🔹 Upload or Update Project
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      return Swal.fire("Required", "Please fill in all fields!", "warning");
    }

    setUploading(true);
    let imageUrl = editImg;

    try {
      if (file) {
        // ✅ sanitize file name (remove spaces)
        const sanitizedFileName = file.name.replace(/\s+/g, "_");
        const storageRef = ref(
          storage,
          `otherProjects/${Date.now()}_${sanitizedFileName}`
        );
        const uploadTask = uploadBytesResumable(storageRef, file);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const percent =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setProgress(Math.round(percent));
            },
            (err) => reject(err),
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            }
          );
        });
      }

      if (editId) {
        await updateDoc(doc(db, "otherProjects", editId), {
          title,
          description,
          img: imageUrl,
          updatedAt: new Date(),
        });
      } else {
        await addDoc(collection(db, "otherProjects"), {
          title,
          description,
          img: imageUrl || "",
          createdAt: new Date(),
        });
      }

      // ✅ Reset form
      setTitle("");
      setDescription("");
      setFile(null);
      setEditId(null);
      setEditImg(null);
      setProgress(0);
      setUploading(false);
      fetchProjects();

      Swal.fire({
        icon: "success",
        title: editId ? "Project updated!" : "Project uploaded!",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate("/others");
      });
    } catch (err) {
      console.error("Error uploading:", err);
      Swal.fire("Error", "Something went wrong during upload!", "error");
      setUploading(false);
    }
  };

  // 🔹 Edit Project
  const handleEdit = (project) => {
    setEditId(project.id);
    setTitle(project.title);
    setDescription(project.description);
    setEditImg(project.img);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🔹 Delete Project
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the project.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDoc(doc(db, "otherProjects", id));
          Swal.fire("Deleted!", "The project has been deleted.", "success");
          fetchProjects();
        } catch (err) {
          console.error("Delete failed:", err);
          Swal.fire("Error", "Failed to delete project!", "error");
        }
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <Helmet>
        <title>Manage Other Projects - Admin</title>
      </Helmet>

      <h1 className="text-4xl font-extrabold mb-8 text-center text-indigo-600">
        Manage Other Projects
      </h1>

      {/* 🔹 Upload / Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 mb-10"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {editId ? "Edit Project" : "Upload New Project"}
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Project Title
            </label>
            <input
              type="text"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter project description"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 h-32 resize-none"
          ></textarea>
        </div>

        {uploading && (
          <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
            <div
              className="bg-indigo-600 h-3 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className={`mt-6 w-full py-3 rounded-lg text-white font-semibold ${
            uploading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
          } transition duration-300`}
        >
          {uploading
            ? `Uploading... ${progress}%`
            : editId
            ? "Update Project"
            : "Upload Project"}
        </button>
      </form>

      {/* 🔹 Project List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {projects.map((p) => (
          <div
            key={p.id}
            className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition relative"
          >
            <img
              src={p.img || "/placeholder.jpg"}
              alt={p.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {p.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-3">
                {p.description}
              </p>

              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleEdit(p)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-full shadow-md transition"
                  title="Edit Project"
                >
                  <FaEdit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-md transition"
                  title="Delete Project"
                >
                  <FaTrash size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadOtherProject;
