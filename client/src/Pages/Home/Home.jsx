import { useGetProductQuery } from "../../api/productApiSlice";
import "./Home.css";

const Home = () => {
  const {
    data: products,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetProductQuery()

  return (
    <div>
      <h1>Home</h1>
      <p>{JSON.stringify(products)}</p>
    </div>
  );
}

export default Home;