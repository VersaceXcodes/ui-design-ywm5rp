   const handleSearch = async (event: React.FormEvent) => {
       event.preventDefault();
       try {
           const response = await axios.get(`/api/projects?search=${search_query}`, {
               headers: { Authorization: `Bearer ${auth_user?.token}` }
           });
           console.log(response.data);
       } catch (error) {
           console.error("Search failed", error);
       }
   };