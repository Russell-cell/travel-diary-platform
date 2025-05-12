import React, { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from 'lodash';
import Taro from '@tarojs/taro';
import { ScrollView, View, Image, Text, Input, Button } from '@tarojs/components';
import Card from './Card';
import Header from './Header';
import { NGROK_URL } from '../../config/ngrok';
import { getToken } from '../../util/tokenRelated';
import './WaterfallPage.scss';

const WaterfallPage = ({ searchKey }) => {
  /* const [columns, setColumns] = useState({ left: [], right: [] }); */
  const columnRefs = [useRef(null), useRef(null)];
  const componentRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [columns, setColumns] = useState([[], []]);
  const heightCache = useRef(new Map());
  const [error, setError] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [noMore, setNoMore] = useState(false);
  const pageRef = useRef(1);
  
  useEffect(() => {
    const fetchPosts = async () => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        // 实际数据加载函数
        const loadData = async (isRefreshing = false) => {
          if (isRefreshing) {
            pageRef.current = 1;
            setIsSearching(false);
          }
          if (isSearching) return;
          if (isLoading) return;
          setIsLoading(true);
          try {
            const response = await Taro.request({
              url: `${NGROK_URL}/travels/getTravels`,
              method: 'GET',
              data: {
                page: pageRef.current,
                pageSize: 10,
                query: searchText
              }
            });
            const travels = response.data.travels;
            if (travels.length < 10) setNoMore(true);
            const newPosts = travels.map(travel => ({
              id: travel._id,
              image: travel.photo[0]?.uri || '/images/default.jpg',
              title: travel.title,
              author: {
                name: travel.userInfo.nickname,
                avatar: travel.userInfo.avatar
              }
            }));
            setColumns(prev => prev.map((col, idx) => {
              const start = idx * (newPosts.length / 2);
              return [...col, ...newPosts.slice(start, start + (newPosts.length / 2))];
            }));
            if (isRefreshing) setCurrentPage(1);
            else setCurrentPage(prev => prev + 1);
            pageRef.current++;
          } catch (error) {
            console.error('加载失败:', error);
            setError(true);
          } finally {
            setIsLoading(false);
            setRefreshing(false);
          }
        };
        
        const newPosts = mockPosts(currentPage, searchKey);
        Taro.nextTick(() => {
          if (!componentRef.current) return;
          const query = Taro.createSelectorQuery().in(componentRef.current);
          query.select('.column-0').boundingClientRect()
          query.select('.column-1').boundingClientRect()
          query.exec((res) => {
            // 使用缓存高度计算列总高度
            const leftTotalHeight = columns[0].reduce((sum, post) => sum + (heightCache.current.get(post.id) || 0), 0);
            const rightTotalHeight = columns[1].reduce((sum, post) => sum + (heightCache.current.get(post.id) || 0), 0);
            
            const sortedPosts = [...newPosts];
            const newColumns = [[...columns[0]], [...columns[1]]];
            
            sortedPosts.forEach(post => {
              if (leftTotalHeight <= rightTotalHeight) {
                newColumns[0].push(post);
              } else {
                newColumns[1].push(post);
              }
            });
            // 更新新增卡片的高度缓存
            Taro.nextTick(() => measureElements());
            
            setColumns(newColumns);
          });
        });
        setCurrentPage(prev => prev + 1);
      } catch (error) {
        console.error('加载游记失败:', error);
      }
      setIsLoading(false);
    };
    fetchPosts();
  }, [currentPage, searchKey, isLoading]);

  const measureElements = () => {
    if (!componentRef.current) return; // 检查组件是否已挂载
    const query = Taro.createSelectorQuery().in(componentRef.current);
    // Flatten columns to get all posts in both columns
    const allPosts = columns.flat();
    allPosts.forEach(post => {
      query.select(`#card-${post.id}`).boundingClientRect();
    });
    query.exec(res => {
      res.forEach((rect, index) => {
        const post = allPosts[index];
        if (rect && post) { // Add null checks
          heightCache.current.set(post.id, rect.height);
        }
      });
    });
  };

  useEffect(() => {
    // 响应式布局
    const handleResize = debounce(() => {
      Taro.getSystemInfo().then(info => {
        const screenWidth = info.screenWidth;
        let columnCount = 2;
        setColumns(Array.from({length: columnCount}, () => []));
      });
    }, 300);
    handleResize();
    Taro.onWindowResize(handleResize);
    return () => Taro.offWindowResize(handleResize);
  }, [])

  const handleSearch = async () => {
  setIsSearching(true);
  pageRef.current = 1;
  await loadData(true);
  setIsSearching(false);
};

const handleScroll = useCallback(debounce((e) => {
    const scrollTop = e.detail.scrollTop;
    const scrollHeight = e.detail.scrollHeight;
    const clientHeight = e.detail.clientHeight;
    if (scrollTop + clientHeight >= scrollHeight - 200 && !isLoading) {
      setCurrentPage(prev => prev + 1);
    }
  }, 300), [isLoading]);



  return (
    <ScrollView ref={componentRef} className="waterfall-container" onScroll={handleScroll} scrollY>
      <Header 
  searchText={searchText} 
  setSearchText={(e) => setSearchText(e.detail.value)} 
  handleSearch={handleSearch} 
/>
<View className="waterfall-grid">
        {columns?.map((column, columnIndex) => (
          <View key={`column-${columnIndex}`} className={`column-${columnIndex}`}>
            {column.map(post => (
              <Card
                key={post.id}
                item={{...post, id: post.id, image: post.image, title: post.title, author: { avatar: post.author.avatar, name: post.author.name }}}
            />
            ))}
          </View>
        ))}
      </View>
      {error && 
        <View className="error-fallback">
          <Text>内容加载失败，请检查网络连接</Text>
          <Button onClick={() => setCurrentPage(1)}>重试</Button>
        </View>}
      {isLoading && <View className="loading-mask">加载中...</View>}
    </ScrollView>
  );
};


export default WaterfallPage;